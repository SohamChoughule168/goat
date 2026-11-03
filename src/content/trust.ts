export interface HandoverPlate {
  index: string;
  title: string;
  body: string;
}

export const handoverPlates: HandoverPlate[] = [
  {
    index: "01",
    title: "The diagnosis",
    body:
      "A written account of where enquiries, admissions and parent communication break, mapped to each branch and ready to share with your board.",
  },
  {
    index: "02",
    title: "The scope",
    body:
      "What is built, what is not, and who owns each seam: the site, the admissions path, the student system and every integration in between.",
  },
  {
    index: "03",
    title: "The runbook",
    body:
      "Accounts, environments and the steps to run the system without us. Credentials transfer to your name, and the notes stay with the team.",
  },
  {
    index: "04",
    title: "The keys",
    body:
      "Ownership transferred in your name, not ours. Code, domains, analytics and hosting accounts are handed over with full administrative access.",
  },
];
