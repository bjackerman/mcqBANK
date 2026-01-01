'use client';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Test } from './types';

// Extend jsPDF with autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export const generatePdf = (test: Test) => {
  // Generate Test Questions PDF
  const doc = new jsPDF() as jsPDFWithAutoTable;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(test.title, 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  let y = 30;
  test.questions.forEach((q, index) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    const questionText = doc.splitTextToSize(`${index + 1}. ${q.questionText}`, 180);
    doc.text(questionText, 15, y);
    y += (questionText.length * 5) + 5;
    
    doc.setFont('helvetica', 'normal');
    q.options.forEach((option, optionIndex) => {
        const optionLabel = String.fromCharCode(97 + optionIndex); // a, b, c, d
        const optionText = doc.splitTextToSize(`${optionLabel}) ${option}`, 170);
        doc.text(optionText, 20, y);
        y += (optionText.length * 5) + 2;
    });
    y += 10;
  });

  doc.save(`${test.title.replace(/\s+/g, '_')}_questions.pdf`);

  // Generate Answer Key PDF
  const answerKeyDoc = new jsPDF() as jsPDFWithAutoTable;
  answerKeyDoc.setFontSize(20);
  answerKeyDoc.text(`${test.title} - Answer Key`, 105, 20, { align: 'center' });

  const body = test.questions.map((q, index) => [index + 1, q.correctAnswer]);

  answerKeyDoc.autoTable({
    head: [['Question No.', 'Correct Answer']],
    body: body,
    startY: 30,
    theme: 'grid',
    styles: {
        halign: 'center'
    },
    headStyles: {
        fillColor: [51, 51, 51], // #333333
        textColor: 255
    }
  });

  answerKeyDoc.save(`${test.title.replace(/\s+/g, '_')}_answer_key.pdf`);
};
