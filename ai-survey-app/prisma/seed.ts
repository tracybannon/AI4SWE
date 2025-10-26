/**
 * Database Seed Script
 *
 * Seeds the database with initial configurable questions for the AI adoption survey
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Initial survey questions
 */
const initialQuestions = [
  {
    order: 1,
    text: 'What is your business domain?',
    type: 'text',
    required: true,
    active: true,
    category: 'Organization',
    placeholder: 'e.g., Healthcare, Finance, E-commerce',
    helpText: 'Specify the primary industry or domain your organization operates in',
  },
  {
    order: 2,
    text: 'What software development methodology do you use?',
    type: 'select',
    required: true,
    active: true,
    category: 'Process',
    options: JSON.stringify([
      'Agile (Scrum)',
      'Agile (Kanban)',
      'Waterfall',
      'DevOps',
      'Lean',
      'Hybrid',
      'Other',
    ]),
    helpText: 'Select the primary methodology your team follows',
  },
  {
    order: 3,
    text: 'What tasks or phase in the software development life cycle are you targeting?',
    type: 'multiselect',
    required: true,
    active: true,
    category: 'Scope',
    options: JSON.stringify([
      'Requirements Gathering',
      'Design & Architecture',
      'Development & Coding',
      'Code Review',
      'Testing & QA',
      'Deployment',
      'Monitoring & Maintenance',
      'Documentation',
      'Project Management',
    ]),
    helpText: 'Select all phases you plan to enhance with AI tools (multiple selections allowed)',
  },
  {
    order: 4,
    text: 'Why are you doing this?',
    type: 'textarea',
    required: true,
    active: true,
    category: 'Motivation',
    placeholder: 'Describe your motivation and expected benefits...',
    helpText: 'Explain the business drivers and objectives for adopting AI-augmented tools',
  },
  {
    order: 5,
    text: 'How will you measure your success?',
    type: 'textarea',
    required: true,
    active: true,
    category: 'Success Criteria',
    placeholder: 'Describe your success metrics and KPIs...',
    helpText: 'Define specific, measurable outcomes that indicate successful adoption',
  },
  {
    order: 6,
    text: 'What software measures or metrics do you collect now?',
    type: 'multiselect',
    required: true,
    active: true,
    category: 'Baseline Metrics',
    options: JSON.stringify([
      'Velocity/Story Points',
      'Cycle Time',
      'Lead Time',
      'Deployment Frequency',
      'Mean Time to Recovery (MTTR)',
      'Change Failure Rate',
      'Code Coverage',
      'Defect Density',
      'Customer Satisfaction (CSAT/NPS)',
      'Team Satisfaction',
      'Cost per Feature',
      'None',
      'Other',
    ]),
    helpText: 'Select all metrics currently tracked by your team',
  },
];

/**
 * Main seed function
 */
async function main() {
  console.log('Starting database seed...');

  // Clear existing questions (optional - remove in production if you want to preserve data)
  if (process.env.NODE_ENV === 'development') {
    await prisma.question.deleteMany({});
    console.log('Cleared existing questions');
  }

  // Create questions
  for (const question of initialQuestions) {
    await prisma.question.create({
      data: question,
    });
    console.log(`Created question: ${question.text}`);
  }

  console.log('Database seed completed successfully!');
}

/**
 * Execute seed and handle errors
 */
main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
