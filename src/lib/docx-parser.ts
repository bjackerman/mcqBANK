import AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";

export interface ParsedQuestion {
  questionText: string;
  options: string[];
  correctAnswer?: string;
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
  textNodeName: "#text",
});

const optionLetterMap = ["A", "B", "C", "D", "E", "F", "G", "H"];

const isQuestionLine = (line: string) =>
  /^(?:Q\s*)?\d+[\).:\-]\s+/.test(line) || (line.endsWith("?") && line.length > 3);

const getOptionIndex = (letter: string) =>
  optionLetterMap.findIndex((value) => value.toLowerCase() === letter.toLowerCase());

const collectText = (node: unknown, parts: string[]) => {
  if (typeof node === "string") {
    parts.push(node);
    return;
  }

  if (Array.isArray(node)) {
    node.forEach((item) => collectText(item, parts));
    return;
  }

  if (node && typeof node === "object") {
    Object.entries(node).forEach(([key, value]) => {
      if (key === "t") {
        collectText(value, parts);
        return;
      }

      collectText(value, parts);
    });
  }
};

const extractParagraphText = (paragraph: unknown) => {
  const parts: string[] = [];
  collectText(paragraph, parts);
  return parts.join("").trim();
};

export const extractDocxText = (buffer: Buffer) => {
  const zip = new AdmZip(buffer);
  const documentXml = zip.readAsText("word/document.xml");
  const parsed = xmlParser.parse(documentXml);
  const body = parsed?.document?.body;
  const paragraphs = Array.isArray(body?.p) ? body.p : body?.p ? [body.p] : [];
  const lines = paragraphs
    .map(extractParagraphText)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return lines.join("\n");
};

export const parseDocxTextToQuestions = (text: string): ParsedQuestion[] => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const questions: ParsedQuestion[] = [];
  let current: ParsedQuestion | null = null;

  const pushCurrent = () => {
    if (!current) return;
    if (current.options.length >= 2 && current.questionText) {
      questions.push(current);
    }
    current = null;
  };

  lines.forEach((line) => {
    const questionMatch = line.match(/^(?:Q\s*)?\d+[\).:\-]\s+(.+)$/i);
    const answerMatch = line.match(/^(?:Answer|Correct Answer)\s*[:\-]\s*(.+)$/i);
    const optionMatch = line.match(/^([A-H])\s*[\).:\-]\s*(.+)$/i);
    const bulletMatch = line.match(/^[-*]\s+(.+)/);

    if (questionMatch || (!current && isQuestionLine(line))) {
      pushCurrent();
      current = {
        questionText: (questionMatch?.[1] ?? line).trim(),
        options: [],
      };
      return;
    }

    if (!current) {
      return;
    }

    if (answerMatch) {
      const answerValue = answerMatch[1].trim();
      const letterMatch = answerValue.match(/^([A-H])$/i);
      if (letterMatch) {
        const index = getOptionIndex(letterMatch[1]);
        if (index >= 0 && current.options[index]) {
          current.correctAnswer = current.options[index];
        }
        return;
      }

      const prefixedLetterMatch = answerValue.match(/^([A-H])\s*[\).:\-]\s*(.+)$/i);
      if (prefixedLetterMatch) {
        current.correctAnswer = prefixedLetterMatch[2].trim();
        return;
      }

      current.correctAnswer = answerValue;
      return;
    }

    if (optionMatch) {
      current.options.push(optionMatch[2].trim());
      return;
    }

    if (bulletMatch) {
      current.options.push(bulletMatch[1].trim());
      return;
    }

    if (current.options.length === 0) {
      current.questionText = `${current.questionText} ${line}`.trim();
    }
  });

  pushCurrent();
  return questions;
};
