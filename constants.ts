// --- constants.ts ---
export const REPORT_TYPES = [
    { value: 'petition', label: 'دادخواست' },
    { value: 'complaint', label: 'شکوائیه' },
    { value: 'contract', label: 'قرارداد' },
    { value: 'legal_warning', label: 'اظهارنامه' },
    { value: 'statement', label: 'لایحه' },
];

export const PROMPT_MAP: { [key: string]: string } = {
    petition: `You are an expert Iranian lawyer. Draft a formal petition (دادخواست) based on the following:
    Topic: {topic}
    Description: {description}
    The petition must be structured correctly for the Iranian judicial system, including sections for the plaintiff (خواهان), defendant (خوانده), subject of demand (خواسته), and a detailed explanation of the matter (شرح دادخواست). Use formal legal Persian.`,
    complaint: `You are an expert Iranian prosecutor's assistant. Draft a formal criminal complaint (شکوائیه) based on the following:
    Topic: {topic}
    Description: {description}
    The complaint must be structured for the Iranian judiciary, detailing the complainant (شاکی), the accused (مشتکی عنه), the subject of the complaint (موضوع شکایت), and a comprehensive explanation of the events (شرح شکایت). Use formal and precise legal Persian.`,
    contract: `You are an expert Iranian legal advisor specializing in contracts. Draft a comprehensive and legally sound contract (قرارداد) based on the following:
    Topic: {topic}
    Description: {description}
    The contract should include standard clauses such as parties, subject matter, duration, financial terms, obligations of the parties, termination clauses, and dispute resolution, all compliant with Iranian law. Use clear and unambiguous legal Persian.`,
    legal_warning: `You are an expert Iranian lawyer. Draft a formal legal warning (اظهارنامه) based on the following:
    Topic: {topic}
    Description: {description}
    The document should clearly state the sender (اظهارکننده), the recipient (مخاطب), the subject (موضوع), and a detailed explanation of the legal claim or demand, formatted for official service through the judicial system. Use formal legal Persian.`,
    statement: `You are an expert Iranian lawyer. Draft a persuasive legal statement (لایحه) to be submitted to a court, based on the following:
    Topic: {topic}
    Description: {description}
    The statement should present arguments, evidence, and legal reasoning in a structured manner to support the client's position in an ongoing case. It must be respectful, formal, and persuasive. Use formal legal Persian.`,
};

export const en = {
    aiHero: {
        title: "AI Legal Assistant",
        subtitle: "Your intelligent partner for drafting documents, finding lawyers, and developing case strategies."
    },
    header: {
        home: "Home",
        investment: "Investment",
        aiAssistant: "Legal Drafter",
        lawyerFinder: "Lawyer Finder",
        newsSummarizer: "News Summarizer",
        caseStrategist: "Case Strategist",
        personalityAnalyst: "Personality Analyst",
        contractGenerator: "Contract Generator",
        legalResearch: "Legal Research",
        depositionSummarizer: "Deposition Summarizer",
        eDiscoveryHelper: "E-Discovery Helper",
        pythonProjects: "Python Projects",
        services: "Services",
        about: "About Us",
        contact: "Contact",
        createCheckpoint: "Save",
        createCheckpointTitle: "Save the current state as a checkpoint",
        checkpoints: "Checkpoints",
        projectHistory: "Project History",
        restore: "Restore",
        delete: "Delete",
        noCheckpoints: "No checkpoints saved yet."
    },
    deeperAnalysis: {
        prompt: "Analyze the following legal document for potential risks, logical fallacies, and areas for improvement. Provide a concise, actionable summary. Document: {documentText}",
        title: "Deeper Analysis",
        analyzing: "Analyzing...",
        placeholder: "Get a deeper, AI-powered analysis of the generated document.",
        buttonText: "Analyze Document"
    },
    newsSummarizer: {
        prompt: "Summarize the latest news and developments about '{query}'. Provide a neutral, factual summary and list the main sources.",
        validationError: "Please enter a topic to summarize.",
        title: "Legal & Business News Summarizer",
        subtitle: "Get AI-powered summaries of the latest news relevant to your case or business, with sources.",
        queryLabel: "Topic or Question",
        queryPlaceholder: "e.g., 'Recent changes to intellectual property law in the EU' or 'latest quarterly report for Company X'",
        summarizing: "Summarizing...",
        buttonText: "Summarize News",
        resultsTitle: "Summary & Sources",
        sourcesTitle: "Sources",
        noSources: "No sources were found for this summary.",
        tryExample: "Or try an example:",
        examples: [
          { label: "Tech Law Updates", query: "Recent changes and proposed regulations for AI in the European Union" },
          { label: "Corporate Finance News", query: "The impact of recent interest rate changes on the real estate market in Iran" }
        ]
    },
    caseStrategist: {
        prompt: "Given the primary goal of: '{goal}', break it down into a strategic project plan. Generate a list of key tasks, including a description, estimated effort percentage, the type of deliverable for each task, and a suggested high-quality AI prompt to generate that deliverable.",
        validationError: "Please define a goal for the strategy.",
        title: "AI Case Strategist",
        subtitle: "Define your legal or business goal, and let AI generate a structured plan with actionable tasks.",
        goalLabel: "Primary Goal",
        goalPlaceholder: "e.g., 'Launch a new tech startup', 'Prepare for a breach of contract litigation', 'Develop a comprehensive marketing plan'",
        generating: "Generating Strategy...",
        buttonText: "Generate Strategy",
        resultsTitle: "Strategic Plan",
        effort: "Effort",
        deliverable: "Deliverable",
        suggestedPrompt: "View AI Prompt",
        copyPrompt: "Copy",
        copiedPrompt: "Copied!",
        tryExample: "Or try an example:",
        examples: [
          { label: "Litigation Prep", goal: "Prepare for litigation regarding a breach of a software development contract." },
          { label: "Business Launch", goal: "Create a strategic plan to launch a new online legal-tech service in Iran." }
        ]
    },
    personalityAnalyst: {
        prompt: "Analyze the following text to create a personality profile based on the Light Triad (Kantianism, Humanism, Faith in Humanity) and Sternberg's Triangular Theory of Love (Intimacy, Passion, Commitment). For each of the 6 traits, provide a score from 1-10, a brief reasoning for the score based on the text, and a constructive suggestion. Text: '{text}'",
        validationError: "Please enter text to analyze.",
        title: "Personality & Communication Analyst",
        subtitle: "Analyze text (e.g., emails, statements) to understand personality traits and communication styles.",
        textLabel: "Text to Analyze",
        textPlaceholder: "Paste text here, such as an email from opposing counsel, a client statement, or a business proposal...",
        analyzing: "Analyzing...",
        buttonText: "Analyze Text",
        resultsTitle: "Analysis Results",
        traits: {
            kantianism: "Kantianism",
            humanism: "Humanism",
            faithInHumanity: "Faith in Humanity",
            intimacy: "Intimacy",
            passion: "Passion",
            commitment: "Commitment"
        },
        lightTriadTitle: "Light Triad Profile",
        lightTriadDescription: "This profile assesses everyday virtuous and positive personality traits.",
        loveTriadTitle: "Communication Style Profile (Love Triad)",
        loveTriadDescription: "This profile, based on Sternberg's theory, assesses core components of interpersonal communication and connection.",
        score: "Score",
        reasoning: "Reasoning",
        suggestion: "Suggestion",
        tryExample: "Or try an example:",
        examples: [
          { label: "Opposing Counsel Email", text: "Further to our previous correspondence, my client remains steadfast in their position. Your latest proposal is not only unacceptable but frankly insulting. We are prepared to proceed with litigation immediately if a reasonable offer is not forthcoming by Friday EOD." },
          { label: "Client Statement", text: "I'm just so worried about this whole process. I've never been in a situation like this before and I really trust you to guide me through it. I want what's fair, but I'm also scared of what might happen. Thank you for being so patient." }
        ]
    },
    aiGuide: {
        prompt: "Analyze the user's goal: '{goal}'. Based on this, suggest the most relevant modules from this list: ['legal_drafter', 'lawyer_finder', 'news_summarizer', 'case_strategist', 'personality_analyst', 'contract_generator', 'legal_research', 'deposition_summarizer', 'e_discovery_helper']. For each suggestion, provide: 1. A confidence percentage. 2. A brief reasoning. 3. A `suggestedInputs` object containing values extracted from the user's goal to pre-fill the suggested module's form fields. For example, for 'legal_drafter', extract values for 'topic', 'description', and 'docType'. For 'lawyer_finder', extract 'keywords'. Be as specific and comprehensive as possible when extracting these fields. Return up to 3 suggestions.",
        validationError: "Please describe what you want to do.",
        title: "How can I help you?",
        subtitle: "Describe your goal, and I'll guide you to the right tool.",
        placeholder: "e.g., 'I need to sue my landlord', 'Find a corporate lawyer in Tehran', 'What's the latest on the new crypto law?', 'Draft an investment agreement'",
        gettingSuggestions: "Getting suggestions...",
        submitButton: "Guide Me",
        button: "Start with AI Guide",
        resultsTitle: "Recommended Tools",
        confidence: "Confidence",
        goTo: "Go to"
    },
    hero: {
        title: "The Future of Legal Intelligence is Here",
        subtitle: "Leverage the power of AI to streamline your legal work, from drafting complex documents to strategic case planning. Dadgar AI is your dedicated legal co-pilot."
    },
    home: {
        servicesTitle: "Our Services",
        services: [
            { title: "Legal Drafting", text: "Instantly generate petitions, contracts, and other legal documents tailored to your needs." },
            { title: "Lawyer Discovery", text: "Find the right legal expert for your case using our AI-powered search and database." },
            { title: "News Analysis", text: "Stay informed with AI-summarized news and legal updates relevant to your field." },
            { title: "Case Strategy", text: "Break down complex goals into actionable, AI-generated strategic plans." }
        ],
        whyUsTitle: "Why Choose Dadgar AI?",
        whyUsItems: [
            { title: "Efficiency", text: "Reduce hours of manual work to mere minutes. Our AI handles the heavy lifting, so you can focus on what matters." },
            { title: "Accuracy", text: "Trained on vast legal datasets, our AI helps minimize errors and ensures high-quality outputs." },
            { title: "Insight", text: "Gain a strategic edge with AI-powered analysis, from personality assessment to case planning." }
        ]
    },
    generatorForm: {
        validationError: "Please fill in both topic and description.",
        title: "Document Drafting Assistant",
        docType: "Document Type",
        topic: "Topic / Title",
        topicPlaceholder: "e.g., 'Lease agreement for residential property'",
        description: "Key Information & Description",
        descriptionPlaceholder: "Provide all necessary details, parties, terms, and context for the document...",
        buttonText: "Generate Document",
        tryExample: "Or try an example:",
        examples: [
          { label: 'Example: Apartment Lease', topic: 'Lease Agreement for a Residential Apartment', description: 'Landlord: [Landlord Name], Tenant: [Tenant Name], Leased Property: Apartment at [Address], Rent: [Amount] Toman per month, Duration: One year.', docType: 'contract' },
          { label: 'Example: Criminal Complaint', topic: 'Criminal Complaint for Internet Fraud', description: 'Complainant: [Your Name], Accused: [Information of the fraudulent person or website], Details: On [Date], I paid [Amount] Toman for the purchase of [Product] via the website [Website Address], but the product was not delivered.', docType: 'complaint' },
          { label: 'Example: Claim for Payment', topic: 'Petition to Claim Payment on a Promissory Note', description: 'Plaintiff: [Your Name], Defendant: [Debtor\'s Name], Subject of Demand: Claim for payment of a promissory note, number [Note Number], amount [Amount] Toman, plus damages for delay.', docType: 'petition' }
        ]
    },
    reportTypes: {
        petition: "Petition",
        complaint: "Complaint",
        contract: "Contract",
        legal_warning: "Legal Warning",
        statement: "Statement"
    },
    reportDisplay: {
        docTitle: "Generated Document",
        title: "Generated Document",
        export: "Export",
        copy: "Copy Text",
        downloadMD: "Download (.md)",
        downloadDOCX: "Download (.docx)",
        downloadHTML: "Download (.html)",
        printPDF: "Print / Save as PDF",
        generating: "Generating...",
        placeholder1: "Your generated document will appear here.",
        placeholder2: "Fill out the form to get started."
    },
    footer: {
        description: "Dadgar AI is an advanced legal tech platform utilizing artificial intelligence to enhance the efficiency and effectiveness of legal professionals.",
        quickLinksTitle: "Quick Links",
        quickLinks: [
            { text: "Home", link: "#" },
            { text: "Legal Drafter", link: "#" },
            { text: "Lawyer Finder", link: "#" },
            { text: "About Us", link: "#" },
            { text: "Contact", link: "#" }
        ],
        contactTitle: "Contact Us",
        email: "info@dadgar-ai.com",
        address: "Tehran, Iran",
        copyright: "© 2024 Dadgar AI. All Rights Reserved."
    },
    quotaErrorModal: {
        title: "Quota Exceeded",
        body: "You have reached your API request limit for the current period. Please check your account usage or upgrade your plan to continue.",
        cta: "Manage Billing",
        close: "Close"
    },
    lawyerFinder: {
        validationError: "Please enter keywords to search.",
        prompt: "Find up to {maxResults} {entityTypePlural} in Iran specializing in: {queries}. Provide their name, main specialty, city, address, contact info, and official website. Present this as a markdown table with columns: 'Name', 'Specialty', 'City', 'Address', 'Contact Info', 'Website', 'Relevance Score'. Prioritize relevance.",
        title: "AI Legal Professional Finder",
        subtitle: "Describe the expertise you need, and our AI will search for qualified lawyers or notaries.",
        entityTypeLabel: "I'm looking for a:",
        entityTypeLawyer: "Lawyer",
        entityTypeNotary: "Notary Public",
        keywordsLabel: "Required Expertise & Location",
        keywordsPlaceholder: "e.g., 'family law specialist in Isfahan', 'intellectual property and startup lawyer in Tehran'",
        maxResults: "Maximum Results",
        finding: "Finding...",
        findButton: "Find",
        savedTitle: "Saved Professionals",
        clearAll: "Clear All",
        notesLabel: "My Notes",
        notesPlaceholder: "Add notes here...",
        remove: "Remove",
        crateTitle: "Directory",
        crateSubtitle: "Professionals found by the AI are added to this directory.",
        clearCrate: "Clear Entire Directory",
        sortBy: "Sort by",
        sort: {
            relevance: "Relevance",
            city: "City"
        },
        address: "Address",
        contact: "Contact",
        showContact: "Show Contact",
        hideContact: "Hide Contact",
        saved: "Saved",
        save: "Save to List",
        parseErrorTitle: "Could not parse the following AI response into a table:",
        crateEmpty: "Your directory is empty. Use the search above to find legal professionals.",
        tryExample: "Or try an example:",
        examples: [
          { label: "Corporate Lawyer", keywords: "Corporate lawyer in Tehran specializing in international contracts", entityType: 'lawyer' },
          { label: "Notary Public", keywords: "Notary public near Valiasr Square for property deeds", entityType: 'notary' }
        ]
    },
    investmentPage: {
        subtitle: "Explore opportunities to be part of the future of legal tech.",
        projectGoals: {
            title: "🎯 Project Goals",
            body: "This project is designed with the goal of developing an artificial intelligence platform. The funds raised will be used for product development, marketing, and market entry."
        },
        costEstimates: {
            title: "📊 Phase 1 Cost Estimate (6 Months)",
            subtitle: "A transparent comparison of costs for building the Minimum Viable Product (MVP) in different regions.",
            regions: {
                iran: {
                    title: "Iran",
                    data: {
                        headers: ["Role", "Monthly Salary (Toman)", "Count", "Duration (Months)", "Total (Toman)"],
                        rows: [
                            { role: "Developer", salary: "60,000,000", count: 2, months: 6, total: "720,000,000" },
                            { role: "Secretary", salary: "30,000,000", count: 1, months: 6, total: "180,000,000" },
                            { role: "Project Manager", salary: "80,000,000", count: 1, months: 6, total: "480,000,000" },
                            { role: "Total Salaries", salary: "-", count: "-", months: "-", total: "1,380,000,000" },
                            { role: "Overhead (~30%)", salary: "-", count: "-", months: "-", total: "414,000,000" },
                        ],
                        footer: { label: "Phase 1 Total", value: "1,794,000,000 Toman" }
                    }
                },
                arab: {
                    title: "Arab Countries",
                    data: {
                        headers: ["Role", "Monthly Salary (USD)", "Toman Equivalent", "Count", "Duration", "Total (Toman)"],
                        rows: [
                            { role: "Developer", salary: "2,000", equivalent: "200,000,000", count: 2, months: 6, total: "2,400,000,000" },
                            { role: "Secretary", salary: "1,000", equivalent: "100,000,000", count: 1, months: 6, total: "600,000,000" },
                            { role: "Project Manager", salary: "3,000", equivalent: "300,000,000", count: 1, months: 6, total: "1,800,000,000" },
                            { role: "Total Salaries", salary: "-", equivalent: "-", count: "-", months: "-", total: "4,800,000,000" },
                            { role: "Overhead (~30%)", salary: "-", equivalent: "-", count: "-", months: "-", total: "1,440,000,000" },
                        ],
                        footer: { label: "Phase 1 Total", value: "6,240,000,000 Toman" }
                    }
                },
                europe: {
                    title: "Europe",
                    data: {
                        headers: ["Role", "Monthly Salary (USD)", "Toman Equivalent", "Count", "Duration", "Total (Toman)"],
                        rows: [
                            { role: "Developer", salary: "4,000", equivalent: "400,000,000", count: 2, months: 6, total: "4,800,000,000" },
                            { role: "Secretary", salary: "2,000", equivalent: "200,000,000", count: 1, months: 6, total: "1,200,000,000" },
                            { role: "Project Manager", salary: "6,000", equivalent: "600,000,000", count: 1, months: 6, total: "3,600,000,000" },
                            { role: "Total Salaries", salary: "-", equivalent: "-", count: "-", months: "-", total: "9,600,000,000" },
                            { role: "Overhead (~30%)", salary: "-", equivalent: "-", count: "-", months: "-", total: "2,880,000,000" },
                        ],
                        footer: { label: "Phase 1 Total", value: "12,480,000,000 Toman" }
                    }
                },
                usa: {
                    title: "USA",
                    data: {
                        headers: ["Role", "Monthly Salary (USD)", "Toman Equivalent", "Count", "Duration", "Total (Toman)"],
                        rows: [
                            { role: "Developer", salary: "6,000", equivalent: "600,000,000", count: 2, months: 6, total: "7,200,000,000" },
                            { role: "Secretary", salary: "3,000", equivalent: "300,000,000", count: 1, months: 6, total: "1,800,000,000" },
                            { role: "Project Manager", salary: "10,000", equivalent: "1,000,000,000", count: 1, months: 6, total: "6,000,000,000" },
                            { role: "Total Salaries", salary: "-", equivalent: "-", count: "-", months: "-", total: "15,000,000,000" },
                            { role: "Overhead (~30%)", salary: "-", equivalent: "-", count: "-", months: "-", total: "4,500,000,000" },
                        ],
                        footer: { label: "Phase 1 Total", value: "19,500,000,000 Toman" }
                    }
                },
            },
            summary: {
                title: "Summary",
                body: "As shown, the cost of developing the initial version in Iran is significantly lower (around 1.8 billion Toman), which presents a very attractive investment opportunity."
            }
        },
        competitiveLandscape: {
            title: "📈 Competitive Landscape & Our Unique Edge",
            body: "The global legal tech market is rapidly expanding, with major players like Thomson Reuters (Westlaw) and LexisNexis, alongside innovative AI startups such as Harvey AI and Casetext (acquired by Thomson Reuters). While these platforms are powerful, they are primarily focused on US and European legal frameworks and come with premium pricing, making them less accessible or relevant for the Iranian market.",
            advantages: {
                title: "Dadgar AI's Competitive Advantages:",
                points: [
                    { title: "Hyper-Focused on Iranian Law", text: "Our models and prompts are specifically designed for the nuances of Iranian legal language, procedures, and regulations. This provides a level of accuracy and relevance that generic models cannot match." },
                    { title: "Unmatched Cost-Effectiveness", text: "As our cost analysis shows, developing in Iran provides a significant financial advantage, allowing us to offer a powerful, comprehensive suite at a highly competitive price point for the local market." },
                    { title: "All-in-One Integrated Platform", text: "We are building more than just a single tool. Dadgar AI is an integrated assistant for drafting, research, case strategy, and discovery, providing holistic value especially to small firms and solo practitioners." },
                    { title: "Democratizing Legal Tech", text: "Our mission is to make advanced legal technology accessible to all legal professionals in the region, empowering them to work more efficiently and effectively." }
                ]
            }
        },
        roadmap: {
            title: "Project Roadmap",
            phases: [
                { title: "Phase 1: MVP Development", duration: "6 Months", objectives: ["Develop core platform functionality", "Implement key modules (Doc Drafter, Lawyer Finder)", "Internal testing and quality assurance"] },
                { title: "Phase 2: Private Beta & Feedback", duration: "3 Months", objectives: ["Invite a group of lawyers for testing", "Gather feedback and improve the product", "Bug fixing and performance optimization"] },
                { title: "Phase 3: Public Launch & Marketing", duration: "6 Months", objectives: ["Officially launch the platform to the public", "Execute digital marketing campaigns", "Acquire initial users and build a user community"] },
                { title: "Phase 4: Feature Expansion & Scaling", duration: "Ongoing", objectives: ["Add new modules based on market needs", "Improve AI models", "Enter new markets and expand internationally"] }
            ]
        },
        investmentStatus: {
            title: "💰 Investment Status",
            progress: 17,
            statusText: "Goal: 1.8 Billion Toman – Raised: 300 Million Toman"
        },
        methods: {
            title: "📌 Investment Methods",
            crowdfunding: {
                title: "1️⃣ Crowdfunding (Token Purchase)",
                body: "By purchasing support tokens, investors become partners in the project. If the minimum capital is not raised by a specific date, the full amount will be refunded.",
                buyButton: "Buy Support Token"
            },
            seed: {
                title: "2️⃣ Seed Investment",
                body: "It is possible to sign an initial contract and invest directly.",
                contractButton: "View Initial Contract",
                whatsappButton: "Contact via WhatsApp",
                whatsappNumber: "989123456789"
            }
        },
        tokenDrafting: {
            draftButton: "Calculate & Draft",
            calculatorTitle: "Investment Calculator",
            amountLabel: "Investment Amount (Toman)",
            tokensLabel: "Number of Tokens (SITECOIN)",
            tokenPriceInfo: "1 SITECOIN = {price} Toman",
            draftTitle: "Preliminary Draft",
            draftTemplate: "This document confirms the intent to purchase **{tokens} SITECOIN** tokens for a total of **{amount} Toman**. This is a non-binding preliminary draft for review purposes only.",
            closeButton: "Close Calculator"
        }
    },
    contractGenerator: {
        title: "Seed Investment Contract Generator",
        subtitle: "Fill in the details below to generate a draft seed investment agreement.",
        formTitle: "Step 1: Primary Contract Information",
        investorLabel: "Investor Name",
        investorPlaceholder: "e.g., 'Sara Ahmadi'",
        companyLabel: "Project/Company Name",
        companyPlaceholder: "e.g., 'Dadgar AI Project'",
        amountLabel: "Investment Amount (Toman)",
        amountPlaceholder: "e.g., 1,800,000,000",
        shareLabel: "Share Percentage (%)",
        sharePlaceholder: "e.g., 15",
        durationLabel: "Contract Duration (Months)",
        durationPlaceholder: "e.g., 12",
        buttonText: "Generate Contract Text",
        validationError: "Please fill in all fields.",
        generatedTitle: "Generated Contract",
        contractTemplate: `
# Investment Agreement

This agreement is entered into on this day, {date}, between **{investor}** (hereinafter referred to as the "Investor") and **{company}** (hereinafter referred to as the "Project Executor").

---

### Article 1 – Subject of the Agreement
The Investor commits to investing the amount of **{amount} Toman** into the {company} project.

### Article 2 – Investor's Share
In consideration for this investment, the Investor shall be entitled to **{share}%** of the project's profits and equity.

### Article 3 – Term of the Agreement
This agreement shall be valid for a period of **{duration} months** from the date of signing.

### Article 4 – Return on Investment
In the event that the project's objectives are not met within the agreed-upon timeframe, the Investor reserves the right to reclaim the investment through mutually agreed-upon mechanisms.

### Article 5 – Dispute Resolution
Any disputes arising from this agreement shall be resolved through binding arbitration by a mutually appointed arbitrator.

---

<br/>
<br/>

**Investor Signature:** ___________________________

<br/>
<br/>

**Project Executor Signature:** ___________________________
`
    },
    legalResearch: {
        title: "AI Legal Research Assistant",
        subtitle: "Ask complex legal questions and get up-to-date, sourced answers from the web.",
        prompt: "You are a world-class legal research assistant. Provide a comprehensive, well-structured, and neutral answer to the following legal question, drawing on current information. Question: '{query}'. Cite your sources.",
        queryLabel: "Research Question",
        queryPlaceholder: "e.g., 'What are the key precedents regarding software patentability in Iran?' or 'Explain the concept of 'force majeure' in recent contract law.'",
        buttonText: "Research",
        searching: "Researching...",
        resultsTitle: "Research Findings",
        sourcesTitle: "Sources",
        validationError: "Please enter a question to research.",
        tryExample: "Or try an example:",
        examples: [
          { label: "Software Patents", query: "What are the key legal precedents and statutes regarding software patentability in Iran?" },
          { label: "Force Majeure", query: "Explain the application of 'force majeure' in Iranian contract law, especially in light of recent global events." }
        ]
    },
    depositionSummarizer: {
        title: "Deposition & Transcript Summarizer",
        subtitle: "Paste a long legal text, like a deposition, to get a concise, structured summary.",
        prompt: "You are an expert legal analyst. Summarize the following text, identifying key admissions, points of contention, key topics, and action items. Structure the output with clear headings. Text: '{text}'",
        textLabel: "Text to Summarize",
        textPlaceholder: "Paste the full deposition transcript or legal document here...",
        buttonText: "Summarize Text",
        summarizing: "Summarizing...",
        resultsTitle: "Summary",
        validationError: "Please paste text to summarize.",
        tryExample: "Or try an example:",
        examples: [
          { label: "Witness Statement", text: "I was at the corner of Main and First street at approximately 2:15 PM on Tuesday. The light was green for northbound traffic. I saw the red car, a sedan, proceed through the intersection without stopping. It struck the blue truck, which was turning left from the southbound lane. I did not hear any horn before the impact." }
        ]
    },
    eDiscoveryHelper: {
        title: "E-Discovery Keyword Helper",
        subtitle: "Describe your case to generate effective keywords and phrases for electronic discovery.",
        prompt: "You are an expert litigation support specialist. Based on the following case description, generate a structured list of keywords for e-discovery. Case Description: '{caseDesc}'",
        caseDescLabel: "Case Description",
        caseDescPlaceholder: "Provide a summary of the case, including key people, events, dates, and concepts...",
        buttonText: "Generate Keywords",
        generating: "Generating...",
        resultsTitle: "Suggested E-Discovery Keywords",
        validationError: "Please enter a case description.",
        copyAll: "Copy All",
        copied: "Copied!",
        categories: {
            keyPeople: "Key People & Entities",
            keyConcepts: "Key Concepts & Jargon",
            dateRanges: "Potential Date Ranges & Timelines",
            booleanPhrases: "Advanced Boolean Phrases"
        },
        tryExample: "Or try an example:",
        examples: [
          { label: "Contract Dispute", caseDesc: "A breach of contract case between 'InnovateCorp' and 'SupplyCo' regarding the delayed delivery of custom microchips for a product codenamed 'Project Phoenix'. Key people are CEO Jane Doe (InnovateCorp) and account manager John Smith (SupplyCo). The main period of interest is January to June 2023." }
        ]
    }
};

export const fa = {
    aiHero: {
        title: "دستیار حقوقی هوش مصنوعی",
        subtitle: "همیار هوشمند شما برای تنظیم اسناد، یافتن وکلا و تدوین استراتژی پرونده."
    },
    header: {
        home: "خانه",
        investment: "سرمایه‌گذاری",
        aiAssistant: "تنظیم اسناد",
        lawyerFinder: "وکیل‌یاب",
        newsSummarizer: "خلاصه ساز اخبار",
        caseStrategist: "استراتژی پرونده",
        personalityAnalyst: "تحلیل شخصیت",
        contractGenerator: "مولد قرارداد سرمایه‌گذاری",
        legalResearch: "تحقیق حقوقی",
        depositionSummarizer: "خلاصه ساز جلسات",
        eDiscoveryHelper: "دستیار کشف الکترونیکی",
        pythonProjects: "پروژه‌های پایتون",
        services: "خدمات",
        about: "درباره ما",
        contact: "تماس با ما",
        createCheckpoint: "ذخیره",
        createCheckpointTitle: "ذخیره وضعیت فعلی به عنوان یک ایستگاه بازرسی",
        checkpoints: "ایستگاه‌های بازرسی",
        projectHistory: "تاریخچه پروژه",
        restore: "بازیابی",
        delete: "حذف",
        noCheckpoints: "هنوز ایستگاه بازرسی ذخیره نشده است."
    },
    deeperAnalysis: {
        prompt: "سند حقوقی زیر را برای ریسک‌های بالقوه، مغالطه‌های منطقی و زمینه‌های بهبود تحلیل کن. یک خلاصه مختصر و کاربردی ارائه بده. سند: {documentText}",
        title: "تحلیل عمیق‌تر",
        analyzing: "در حال تحلیل...",
        placeholder: "یک تحلیل عمیق‌تر و مبتنی بر هوش مصنوعی از سند ایجاد شده دریافت کنید.",
        buttonText: "تحلیل سند"
    },
    newsSummarizer: {
        prompt: "آخرین اخبار و تحولات در مورد '{query}' را خلاصه کن. یک خلاصه بی‌طرفانه و واقعی ارائه بده و منابع اصلی را لیست کن.",
        validationError: "لطفا یک موضوع برای خلاصه کردن وارد کنید.",
        title: "خلاصه‌ساز اخبار حقوقی و تجاری",
        subtitle: "خلاصه‌های مبتنی بر هوش مصنوعی از آخرین اخبار مرتبط با پرونده یا کسب و کار خود را به همراه منابع دریافت کنید.",
        queryLabel: "موضوع یا سوال",
        queryPlaceholder: "مثلاً 'تغییرات اخیر در قانون مالکیت معنوی' یا 'آخرین گزارش فصلی شرکت X'",
        summarizing: "در حال خلاصه سازی...",
        buttonText: "خلاصه کن",
        resultsTitle: "خلاصه و منابع",
        sourcesTitle: "منابع",
        noSources: "منبعی برای این خلاصه یافت نشد.",
        tryExample: "یا یک نمونه را امتحان کنید:",
        examples: [
          { label: "اخبار فناوری", query: "تغییرات و مقررات پیشنهادی اخیر برای هوش مصنوعی در اتحادیه اروپا" },
          { label: "اخبار مالی", query: "تاثیر تغییرات اخیر نرخ بهره بر بازار املاک و مستغلات در ایران" }
        ]
    },
    caseStrategist: {
        prompt: "با توجه به هدف اصلی: '{goal}'، آن را به یک برنامه پروژه استراتژیک تقسیم کن. لیستی از وظایف کلیدی شامل توضیحات، درصد تخمینی تلاش، نوع خروجی برای هر وظیفه و یک پرامپت پیشنهادی با کیفیت برای هوش مصنوعی جهت تولید آن خروجی ایجاد کن.",
        validationError: "لطفا یک هدف برای استراتژی مشخص کنید.",
        title: "استراتژیست پرونده هوش مصنوعی",
        subtitle: "هدف حقوقی یا تجاری خود را مشخص کنید تا هوش مصنوعی یک برنامه ساختاریافته با وظایف عملیاتی ایجاد کند.",
        goalLabel: "هدف اصلی",
        goalPlaceholder: "مثلاً 'راه‌اندازی یک استارتاپ فناوری جدید'، 'آمادگی برای دعوای نقض قرارداد'، 'توسعه یک برنامه بازاریابی جامع'",
        generating: "در حال ایجاد استراتژی...",
        buttonText: "ایجاد استراتژی",
        resultsTitle: "برنامه استراتژیک",
        effort: "تلاش",
        deliverable: "خروجی",
        suggestedPrompt: "مشاهده پرامپت هوش مصنوعی",
        copyPrompt: "کپی",
        copiedPrompt: "کپی شد!",
        tryExample: "یا یک نمونه را امتحان کنید:",
        examples: [
          { label: "آمادگی برای دعوی", goal: "آمادگی برای دعوای حقوقی در مورد نقض قرارداد توسعه نرم‌افزار." },
          { label: "راه اندازی کسب و کار", goal: "ایجاد یک برنامه استراتژیک برای راه‌اندازی یک سرویس آنلاین فناوری حقوقی جدید در ایران." }
        ]
    },
    personalityAnalyst: {
        prompt: "متن زیر را برای ایجاد یک پروفایل شخصیتی بر اساس Light Triad (کانتیانیسم، اومانیسم، ایمان به بشریت) و نظریه مثلثی عشق استرنبرگ (صمیمیت، شور، تعهد) تحلیل کن. برای هر یک از ۶ ویژگی، یک امتیاز از ۱ تا ۱۰، یک دلیل مختصر برای امتیاز بر اساس متن، و یک پیشنهاد سازنده ارائه بده. متن: '{text}'",
        validationError: "لطفا متنی برای تحلیل وارد کنید.",
        title: "تحلیلگر شخصیت و ارتباطات",
        subtitle: "متن (مانند ایمیل‌ها، اظهارات) را برای درک ویژگی‌های شخصیتی و سبک‌های ارتباطی تحلیل کنید.",
        textLabel: "متن برای تحلیل",
        textPlaceholder: "متن را اینجا وارد کنید، مانند ایمیلی از وکیل طرف مقابل، اظهارات یک موکل، یا یک پیشنهاد تجاری...",
        analyzing: "در حال تحلیل...",
        buttonText: "تحلیل متن",
        resultsTitle: "نتایج تحلیل",
        traits: {
            kantianism: "وظیفه‌گرایی کانتی",
            humanism: "انسان‌گرایی",
            faithInHumanity: "ایمان به بشریت",
            intimacy: "صمیمیت",
            passion: "شور و اشتیاق",
            commitment: "تعهد"
        },
        lightTriadTitle: "پروفایل سه‌گانه روشن",
        lightTriadDescription: "این پروفایل ویژگی‌های شخصیتی مثبت و بافضیلت روزمره را ارزیابی می‌کند.",
        loveTriadTitle: "پروفایل سبک ارتباطی (مثلث عشق)",
        loveTriadDescription: "این پروفایل، بر اساس نظریه استرنبرگ، مولفه‌های اصلی ارتباطات بین فردی و اتصال را ارزیابی می‌کند.",
        score: "امتیاز",
        reasoning: "استدلال",
        suggestion: "پیشنهاد",
        tryExample: "یا یک نمونه را امتحان کنید:",
        examples: [
          { label: "ایمیل وکیل طرف مقابل", text: "پیرو مکاتبات قبلی، موکل من بر موضع خود ثابت قدم است. پیشنهاد اخیر شما نه تنها غیرقابل قبول بلکه صراحتا توهین‌آمیز است. ما آماده‌ایم در صورتی که تا پایان وقت اداری روز جمعه پیشنهاد معقولی ارائه نشود، فوراً اقدام به طرح دعوی نماییم." },
          { label: "اظهارات موکل", text: "من واقعا نگران تمام این فرآیند هستم. هرگز در چنین موقعیتی نبوده‌ام و واقعاً به شما اعتماد دارم که مرا راهنمایی کنید. من چیزی که منصفانه است را می‌خواهم، اما از آنچه ممکن است اتفاق بیفتد نیز می‌ترسم. از شما برای صبوریتان سپاسگزارم." }
        ]
    },
    aiGuide: {
        prompt: "هدف کاربر را تحلیل کن: '{goal}'. بر این اساس، مرتبط‌ترین ماژول‌ها را از این لیست پیشنهاد بده: ['legal_drafter', 'lawyer_finder', 'news_summarizer', 'case_strategist', 'personality_analyst', 'contract_generator', 'legal_research', 'deposition_summarizer', 'e_discovery_helper']. برای هر پیشنهاد، موارد زیر را ارائه بده: ۱. درصد اطمینان. ۲. دلیل مختصر. ۳. یک شیء `suggestedInputs` که شامل مقادیر استخراج شده از هدف کاربر برای پر کردن فرم‌های ماژول پیشنهادی است. مثلاً برای 'legal_drafter'، فیلدهای 'topic'، 'description' و 'docType' را پر کن. برای 'lawyer_finder'، فیلد 'keywords' را پر کن. این فیلدها را تا حد امکان دقیق و کامل استخراج کن. حداکثر ۳ پیشنهاد برگردان.",
        validationError: "لطفا توضیح دهید چه کاری می‌خواهید انجام دهید.",
        title: "چطور می‌توانم کمکتان کنم؟",
        subtitle: "هدف خود را شرح دهید، تا شما را به ابزار مناسب راهنمایی کنم.",
        placeholder: "مثلا 'می‌خواهم از صاحبخانه‌ام شکایت کنم'، 'یک وکیل شرکتی در تهران پیدا کن'، 'آخرین خبر در مورد قانون جدید ارز دیجیتال چیست؟', 'یک قرارداد سرمایه‌گذاری تنظیم کن'",
        gettingSuggestions: "در حال دریافت پیشنهادات...",
        submitButton: "راهنمایی کن",
        button: "با راهنمای هوشمند شروع کنید",
        resultsTitle: "ابزارهای پیشنهادی",
        confidence: "اطمینان",
        goTo: "رفتن به"
    },
    hero: {
        title: "آینده هوش حقوقی اینجاست",
        subtitle: "از قدرت هوش مصنوعی برای بهینه‌سازی کارهای حقوقی خود، از تنظیم اسناد پیچیده تا برنامه‌ریزی استراتژیک پرونده، بهره‌مند شوید. دادگر AI کمک‌یار حقوقی اختصاصی شماست."
    },
    home: {
        servicesTitle: "خدمات ما",
        services: [
            { title: "تنظیم اسناد حقوقی", text: "به سرعت دادخواست، قرارداد و سایر اسناد حقوقی را متناسب با نیاز خود ایجاد کنید." },
            { title: "کشف وکلا", text: "با استفاده از جستجوی هوشمند و پایگاه داده ما، کارشناس حقوقی مناسب پرونده خود را پیدا کنید." },
            { title: "تحلیل اخبار", text: "با خلاصه‌های خبری و به‌روزرسانی‌های حقوقی مرتبط با حوزه کاری خود، مطلع بمانید." },
            { title: "استراتژی پرونده", text: "اهداف پیچیده را به برنامه‌های استراتژیک عملیاتی که توسط هوش مصنوعی تولید شده، تقسیم کنید." }
        ],
        whyUsTitle: "چرا دادگر AI؟",
        whyUsItems: [
            { title: "بهره‌وری", text: "ساعت‌ها کار دستی را به چند دقیقه کاهش دهید. هوش مصنوعی ما کارهای سنگین را انجام می‌دهد تا شما بر روی مسائل مهم تمرکز کنید." },
            { title: "دقت", text: "هوش مصنوعی ما که بر روی مجموعه داده‌های حقوقی گسترده آموزش دیده، به حداقل رساندن خطاها و تضمین خروجی‌های با کیفیت کمک می‌کند." },
            { title: "بینش", text: "با تحلیل‌های مبتنی بر هوش مصنوعی، از ارزیابی شخصیت تا برنامه‌ریزی پرونده، یک مزیت استراتژیک به دست آورید." }
        ]
    },
    generatorForm: {
        validationError: "لطفا هم موضوع و هم توضیحات را پر کنید.",
        title: "دستیار تنظیم سند",
        docType: "نوع سند",
        topic: "موضوع / عنوان",
        topicPlaceholder: "مثلاً 'قرارداد اجاره ملک مسکونی'",
        description: "اطلاعات کلیدی و توضیحات",
        descriptionPlaceholder: "تمام جزئیات لازم، طرفین، شرایط و زمینه مربوط به سند را ارائه دهید...",
        buttonText: "ایجاد سند",
        tryExample: "یا یک نمونه را امتحان کنید:",
        examples: [
          { label: 'نمونه: اجاره آپارتمان', topic: 'قرارداد اجاره یک واحد آپارتمان مسکونی', description: 'موجر: [نام موجر]، مستاجر: [نام مستاجر]، مورد اجاره: آپارتمان به آدرس [آدرس]، اجاره بها: ماهانه [مبلغ] تومان، مدت: یک سال.', docType: 'contract' },
          { label: 'نمونه: شکایت کیفری', topic: 'شکوائیه کلاهبرداری اینترنتی', description: 'شاکی: [نام شما]، مشتکی عنه: [اطلاعات فرد یا وبسایت کلاهبردار]، شرح ماجرا: در تاریخ [تاریخ] مبلغ [مبلغ] تومان بابت خرید [کالا] از طریق وبسایت [آدرس وبسایت] پرداخت کردم اما کالایی دریافت نشد.', docType: 'complaint' },
          { label: 'نمونه: دادخواست مطالبه وجه', topic: 'دادخواست مطالبه وجه سفته', description: 'خواهان: [نام شما]، خوانده: [نام بدهکار]، خواسته: مطالبه وجه یک فقره سفته به شماره [شماره] و مبلغ [مبلغ] تومان به همراه خسارت تاخیر تادیه.', docType: 'petition' }
        ]
    },
    reportTypes: {
        petition: "دادخواست",
        complaint: "شکوائیه",
        contract: "قرارداد",
        legal_warning: "اظهارنامه",
        statement: "لایحه"
    },
    reportDisplay: {
        docTitle: "سند ایجاد شده",
        title: "سند ایجاد شده",
        export: "خروجی",
        copy: "کپی متن",
        downloadMD: "دانلود (.md)",
        downloadDOCX: "دانلود (.docx)",
        downloadHTML: "دانلود (.html)",
        printPDF: "چاپ / ذخیره به صورت PDF",
        generating: "در حال ایجاد...",
        placeholder1: "سند ایجاد شده شما در اینجا نمایش داده خواهد شد.",
        placeholder2: "برای شروع فرم را پر کنید."
    },
    footer: {
        description: "دادگر AI یک پلتفرم پیشرفته فناوری حقوقی است که با استفاده از هوش مصنوعی، کارایی و اثربخشی متخصصان حقوقی را افزایش می‌دهد.",
        quickLinksTitle: "دسترسی سریع",
        quickLinks: [
            { text: "خانه", link: "#" },
            { text: "تنظیم سند", link: "#" },
            { text: "وکیل‌یاب", link: "#" },
            { text: "درباره ما", link: "#" },
            { text: "تماس", link: "#" }
        ],
        contactTitle: "تماس با ما",
        email: "info@dadgar-ai.com",
        address: "تهران، ایران",
        copyright: "© ۲۰۲۴ دادگر AI. تمام حقوق محفوظ است."
    },
    quotaErrorModal: {
        title: "سهمیه تمام شد",
        body: "شما به حد مجاز درخواست API برای دوره فعلی رسیده‌اید. لطفاً مصرف حساب خود را بررسی کرده یا برای ادامه، طرح خود را ارتقا دهید.",
        cta: "مدیریت صورتحساب",
        close: "بستن"
    },
    lawyerFinder: {
        validationError: "لطفا کلیدواژه‌ای برای جستجو وارد کنید.",
        prompt: "حداکثر {maxResults} {entityTypePlural} در ایران با تخصص در: {queries} پیدا کن. نام، تخصص اصلی، شهر، آدرس، اطلاعات تماس و وب‌سایت رسمی آنها را ارائه بده. این اطلاعات را به صورت یک جدول مارک‌داون با ستون‌های: 'Name', 'Specialty', 'City', 'Address', 'Contact Info', 'Website', 'Relevance Score' نمایش بده. مرتبط بودن در اولویت باشد.",
        title: "یابنده هوشمند متخصص حقوقی",
        subtitle: "تخصص مورد نیاز خود را شرح دهید تا هوش مصنوعی ما وکلای واجد شرایط یا دفاتر اسناد رسمی را برای شما جستجو کند.",
        entityTypeLabel: "من به دنبال:",
        entityTypeLawyer: "وکیل",
        entityTypeNotary: "دفتر اسناد رسمی",
        keywordsLabel: "تخصص مورد نیاز و موقعیت مکانی",
        keywordsPlaceholder: "مثلاً 'وکیل متخصص خانواده در اصفهان'، 'دفتر اسناد رسمی در نزدیکی میدان ولیعصر'",
        maxResults: "حداکثر نتایج",
        finding: "در حال یافتن...",
        findButton: "پیدا کردن",
        savedTitle: "متخصصین ذخیره شده",
        clearAll: "پاک کردن همه",
        notesLabel: "یادداشت‌های من",
        notesPlaceholder: "یادداشت‌های خود را اینجا اضافه کنید...",
        remove: "حذف",
        crateTitle: "دایرکتوری",
        crateSubtitle: "متخصصین یافت شده توسط هوش مصنوعی به این دایرکتوری اضافه می‌شوند.",
        clearCrate: "پاک کردن کل دایرکتوری",
        sortBy: "مرتب‌سازی بر اساس",
        sort: {
            relevance: "مرتبط بودن",
            city: "شهر"
        },
        address: "آدرس",
        contact: "تماس",
        showContact: "نمایش اطلاعات تماس",
        hideContact: "پنهان کردن تماس",
        saved: "ذخیره شد",
        save: "ذخیره در لیست",
        parseErrorTitle: "پاسخ هوش مصنوعی زیر قابل تبدیل به جدول نبود:",
        crateEmpty: "دایرکتوری شما خالی است. برای یافتن متخصصین حقوقی از جستجوی بالا استفاده کنید.",
        tryExample: "یا یک نمونه را امتحان کنید:",
        examples: [
          { label: "وکیل شرکتی", keywords: "وکیل شرکتی در تهران متخصص در قراردادهای بین‌المللی", entityType: 'lawyer' },
          { label: "دفتر اسناد رسمی", keywords: "دفتر اسناد رسمی نزدیک میدان ولیعصر برای تنظیم سند ملکی", entityType: 'notary' }
        ]
    },
    investmentPage: {
        subtitle: "فرصت‌های سرمایه‌گذاری برای حضور در آینده فناوری حقوقی را کشف کنید.",
        projectGoals: {
            title: "🎯 اهداف پروژه",
            body: "این پروژه با هدف توسعه پلتفرم هوش مصنوعی طراحی شده است. سرمایه جمع‌آوری‌شده برای توسعه محصول، بازاریابی و ورود به بازار استفاده خواهد شد."
        },
        costEstimates: {
            title: "📊 برآورد هزینه فاز اول (۶ ماه)",
            subtitle: "مقایسه شفاف هزینه‌ها برای ساخت نسخه اولیه (MVP) در مناطق مختلف.",
            regions: {
                iran: {
                    title: "ایران",
                    data: {
                        headers: ["نقش", "حقوق ماهانه (تومان)", "تعداد", "مدت (ماه)", "جمع کل (تومان)"],
                        rows: [
                            { role: "برنامه‌نویس", salary: "60,000,000", count: 2, months: 6, total: "720,000,000" },
                            { role: "منشی", salary: "30,000,000", count: 1, months: 6, total: "180,000,000" },
                            { role: "مدیر پروژه", salary: "80,000,000", count: 1, months: 6, total: "480,000,000" },
                            { role: "جمع حقوق", salary: "-", count: "-", months: "-", total: "1,380,000,000" },
                            { role: "هزینه‌های جانبی (~30%)", salary: "-", count: "-", months: "-", total: "414,000,000" },
                        ],
                        footer: { label: "کل فاز ۱", value: "۱٬۷۹۴٬۰۰۰٬۰۰۰ تومان" }
                    }
                },
                arab: {
                    title: "کشورهای عربی",
                    data: {
                        headers: ["نقش", "حقوق ماهانه (USD)", "معادل تومان", "تعداد", "مدت", "جمع کل (تومان)"],
                        rows: [
                            { role: "برنامه‌نویس", salary: "2,000", equivalent: "200,000,000", count: 2, months: 6, total: "2,400,000,000" },
                            { role: "منشی", salary: "1,000", equivalent: "100,000,000", count: 1, months: 6, total: "600,000,000" },
                            { role: "مدیر پروژه", salary: "3,000", equivalent: "300,000,000", count: 1, months: 6, total: "1,800,000,000" },
                            { role: "جمع حقوق", salary: "-", equivalent: "-", count: "-", months: "-", total: "4,800,000,000" },
                            { role: "هزینه‌های جانبی (~30%)", salary: "-", equivalent: "-", count: "-", months: "-", total: "1,440,000,000" },
                        ],
                        footer: { label: "کل فاز ۱", value: "۶٬۲۴۰٬۰۰۰٬۰۰۰ تومان" }
                    }
                },
                europe: {
                    title: "اروپا",
                    data: {
                        headers: ["نقش", "حقوق ماهانه (USD)", "معادل تومان", "تعداد", "مدت", "جمع کل (تومان)"],
                        rows: [
                            { role: "برنامه‌نویس", salary: "4,000", equivalent: "400,000,000", count: 2, months: 6, total: "4,800,000,000" },
                            { role: "منشی", salary: "2,000", equivalent: "200,000,000", count: 1, months: 6, total: "1,200,000,000" },
                            { role: "مدیر پروژه", salary: "6,000", equivalent: "600,000,000", count: 1, months: 6, total: "3,600,000,000" },
                            { role: "جمع حقوق", salary: "-", equivalent: "-", count: "-", months: "-", total: "9,600,000,000" },
                            { role: "هزینه‌های جانبی (~30%)", salary: "-", equivalent: "-", count: "-", months: "-", total: "2,880,000,000" },
                        ],
                        footer: { label: "کل فاز ۱", value: "۱۲٬۴۸۰٬۰۰۰٬۰۰۰ تومان" }
                    }
                },
                usa: {
                    title: "آمریکا",
                    data: {
                        headers: ["نقش", "حقوق ماهانه (USD)", "معادل تومان", "تعداد", "مدت", "جمع کل (تومان)"],
                        rows: [
                            { role: "برنامه‌نویس", salary: "6,000", equivalent: "600,000,000", count: 2, months: 6, total: "7,200,000,000" },
                            { role: "منشی", salary: "3,000", equivalent: "300,000,000", count: 1, months: 6, total: "1,800,000,000" },
                            { role: "مدیر پروژه", salary: "10,000", equivalent: "1,000,000,000", count: 1, months: 6, total: "6,000,000,000" },
                            { role: "جمع حقوق", salary: "-", equivalent: "-", count: "-", months: "-", total: "15,000,000,000" },
                            { role: "هزینه‌های جانبی (~30%)", salary: "-", equivalent: "-", count: "-", months: "-", total: "4,500,000,000" },
                        ],
                        footer: { label: "کل فاز ۱", value: "۱۹٬۵۰۰٬۰۰۰٬۰۰۰ تومان" }
                    }
                },
            },
            summary: {
                title: "جمع‌بندی",
                body: "همانطور که مشاهده می‌شود، هزینه توسعه نسخه اولیه در ایران به طور قابل توجهی پایین‌تر است (حدود ۱.۸ میلیارد تومان) که این امر فرصت سرمایه‌گذاری بسیار جذابی را فراهم می‌کند."
            }
        },
        competitiveLandscape: {
            title: "📈 چشم‌انداز رقابتی و مزیت منحصربه‌فرد ما",
            body: "بازار جهانی فناوری حقوقی به سرعت در حال گسترش است و بازیگران بزرگی مانند Thomson Reuters (Westlaw) و LexisNexis در کنار استارتاپ‌های نوآور هوش مصنوعی مانند Harvey AI و Casetext در آن حضور دارند. اگرچه این پلتفرم‌ها قدرتمند هستند، اما عمدتاً بر چارچوب‌های حقوقی آمریکا و اروپا متمرکز بوده و قیمت‌گذاری بالایی دارند که دسترسی یا ارتباط آن‌ها را برای بازار ایران کمتر می‌کند.",
            advantages: {
                title: "مزایای رقابتی دادگر AI:",
                points: [
                    { title: "تمرکز ویژه بر حقوق ایران", text: "مدل‌ها و پرامپت‌های ما به طور خاص برای ظرافت‌های زبان، رویه‌ها و مقررات حقوقی ایران طراحی شده‌اند. این امر سطحی از دقت و ارتباط را فراهم می‌کند که مدل‌های عمومی قادر به ارائه آن نیستند." },
                    { title: "به‌صرفه بودن بی‌نظیر", text: "همانطور که تحلیل هزینه ما نشان می‌دهد، توسعه در ایران مزیت مالی قابل توجهی دارد و به ما امکان می‌دهد تا یک مجموعه قدرتمند و جامع را با قیمتی بسیار رقابتی برای بازار داخلی ارائه دهیم." },
                    { title: "پلتفرم یکپارچه همه‌کاره", text: "ما در حال ساخت چیزی فراتر از یک ابزار واحد هستیم. دادگر AI یک دستیار یکپارچه برای تنظیم، تحقیق، استراتژی پرونده و کشف الکترونیکی است که ارزش جامعی را به ویژه برای شرکت‌های کوچک و وکلای انفرادی فراهم می‌کند." },
                    { title: "دموکراتیزه کردن فناوری حقوقی", text: "مأموریت ما این است که فناوری حقوقی پیشرفته را برای تمام متخصصان حقوقی در منطقه قابل دسترس کنیم و آن‌ها را قادر سازیم تا کارآمدتر و مؤثرتر عمل کنند." }
                ]
            }
        },
        roadmap: {
            title: "نقشه راه پروژه",
            phases: [
                { title: "فاز ۱: توسعه MVP", duration: "۶ ماه", objectives: ["توسعه هسته اصلی پلتفرم", "پیاده‌سازی ماژول‌های کلیدی (تنظیم سند، وکیل‌یاب)", "آزمایش‌های داخلی و کنترل کیفیت"] },
                { title: "فاز ۲: نسخه بتای خصوصی و بازخورد", duration: "۳ ماه", objectives: ["دعوت از گروهی از وکلا برای آزمایش", "جمع‌آوری بازخورد و بهبود محصول", "رفع باگ‌ها و بهینه‌سازی عملکرد"] },
                { title: "فاز ۳: عرضه عمومی و بازاریابی", duration: "۶ ماه", objectives: ["راه‌اندازی رسمی پلتفرم برای عموم", "اجرای کمپین‌های بازاریابی دیجیتال", "جذب کاربران اولیه و ایجاد جامعه کاربری"] },
                { title: "فاز ۴: توسعه ویژگی‌ها و مقیاس‌پذیری", duration: "مستمر", objectives: ["اضافه کردن ماژول‌های جدید بر اساس نیاز بازار", "بهبود مدل‌های هوش مصنوعی", "ورود به بازارهای جدید و توسعه بین‌المللی"] }
            ]
        },
        investmentStatus: {
            title: "💰 وضعیت سرمایه‌گذاری",
            progress: 17,
            statusText: "هدف: ۱.۸ میلیارد تومان – تاکنون: ۳۰۰ میلیون تومان"
        },
        methods: {
            title: "📌 روش‌های سرمایه‌گذاری",
            crowdfunding: {
                title: "1️⃣ Crowdfunding (خرید توکن)",
                body: "با خرید توکن حمایتی, سرمایه‌گذاران در پروژه شریک می‌شوند. اگر تا تاریخ معین حداقل سرمایه جمع نشود، کل مبلغ بازگردانده خواهد شد.",
                buyButton: "خرید توکن حمایتی"
            },
            seed: {
                title: "2️⃣ سرمایه‌گذاری اولیه (Seed Investment)",
                body: "امکان امضای قرارداد اولیه و سرمایه‌گذاری مستقیم وجود دارد.",
                contractButton: "مشاهده قرارداد اولیه",
                whatsappButton: "ارتباط واتس‌اپ",
                whatsappNumber: "989123456789"
            }
        },
        tokenDrafting: {
            draftButton: "محاسبه و پیش‌نویس",
            calculatorTitle: "ماشین حساب سرمایه‌گذاری",
            amountLabel: "مبلغ سرمایه‌گذاری (تومان)",
            tokensLabel: "تعداد توکن (SITECOIN)",
            tokenPriceInfo: "هر ۱ توکن SITECOIN = {price} تومان",
            draftTitle: "پیش‌نویس اولیه",
            draftTemplate: "این سند намерение خرید **{tokens} توکن SITECOIN** به مبلغ کل **{amount} تومان** را تایید می‌کند. این یک پیش‌نویس اولیه غیر الزام‌آور و فقط برای بررسی است.",
            closeButton: "بستن ماشین حساب"
        }
    },
    contractGenerator: {
        title: "مولد قرارداد جذب سرمایه",
        subtitle: "برای ایجاد پیش‌نویس قرارداد سرمایه‌گذاری اولیه، اطلاعات زیر را تکمیل کنید.",
        formTitle: "مرحله ۱: اطلاعات اولیه قرارداد",
        investorLabel: "نام سرمایه‌گذار",
        investorPlaceholder: "مثلاً 'سارا احمدی'",
        companyLabel: "نام پروژه/شرکت",
        companyPlaceholder: "مثلاً 'پروژه دادگر AI'",
        amountLabel: "مبلغ سرمایه‌گذاری (تومان)",
        amountPlaceholder: "مثلاً ۱,۸۰۰,۰۰۰,۰۰۰",
        shareLabel: "درصد سهم (٪)",
        sharePlaceholder: "مثلاً ۱۵",
        durationLabel: "مدت قرارداد (ماه)",
        durationPlaceholder: "مثلاً ۱۲",
        buttonText: "📄 تولید متن قرارداد",
        validationError: "لطفاً تمام فیلدها را پر کنید.",
        generatedTitle: "قرارداد ایجاد شده",
        contractTemplate: `
# قرارداد جذب سرمایه‌گذاری

این قرارداد فی‌مابین **{investor}** (سرمایه‌گذار) و **{company}** (مجری پروژه) در تاریخ {date} منعقد می‌گردد.

---

### ماده ۱ – موضوع قرارداد
سرمایه‌گذار متعهد می‌شود مبلغ **{amount} تومان** در پروژه {company} سرمایه‌گذاری نماید.

### ماده ۲ – سهم سرمایه‌گذار
در قبال این سرمایه‌گذاری، سرمایه‌گذار مالک **{share}٪** از منافع و سهام پروژه خواهد بود.

### ماده ۳ – مدت قرارداد
این قرارداد برای مدت **{duration} ماه** از تاریخ امضا معتبر خواهد بود.

### ماده ۴ – بازگشت سرمایه
در صورت عدم تحقق اهداف پروژه، سرمایه‌گذار حق استرداد سرمایه را از طریق سازوکارهای توافق‌شده خواهد داشت.

### ماده ۵ – حل اختلاف
در صورت بروز اختلاف، موضوع از طریق داوری مرضی‌الطرفین حل و فصل خواهد شد.

---

<br/>
<br/>

**امضا سرمایه‌گذار:** ___________________________

<br/>
<br/>

**امضا مجری پروژه:** ___________________________
`
    },
    legalResearch: {
        title: "دستیار تحقیق حقوقی هوشمند",
        subtitle: "سوالات پیچیده حقوقی بپرسید و پاسخ‌های به‌روز و مستند از وب دریافت کنید.",
        prompt: "شما یک دستیار تحقیق حقوقی در سطح جهانی هستید. یک پاسخ جامع، ساختاریافته و بی‌طرفانه به سوال حقوقی زیر با استناد به اطلاعات روز ارائه دهید. سوال: '{query}'. منابع خود را ذکر کنید.",
        queryLabel: "سوال تحقیقی",
        queryPlaceholder: "مثلاً 'رویه قضایی کلیدی در مورد قابلیت ثبت اختراع نرم‌افزار در ایران چیست؟' یا 'مفهوم 'فورس ماژور' در قانون قراردادهای اخیر را توضیح دهید.'",
        buttonText: "تحقیق",
        searching: "در حال تحقیق...",
        resultsTitle: "یافته‌های تحقیق",
        sourcesTitle: "منابع",
        validationError: "لطفا یک سوال برای تحقیق وارد کنید.",
        tryExample: "یا یک نمونه را امتحان کنید:",
        examples: [
          { label: "پتنت نرم‌افزار", query: "رویه قضایی و قوانین کلیدی در مورد قابلیت ثبت اختراع نرم‌افزار در ایران چیست؟" },
          { label: "فورس ماژور", query: "کاربرد 'فورس ماژور' در قانون قراردادهای ایران، به ویژه با توجه به رویدادهای اخیر جهانی را توضیح دهید." }
        ]
    },
    depositionSummarizer: {
        title: "خلاصه‌ساز اظهارات و صورت‌جلسات",
        subtitle: "یک متن حقوقی طولانی، مانند صورت‌جلسه، را وارد کنید تا خلاصه‌ای دقیق و ساختاریافته دریافت کنید.",
        prompt: "شما یک تحلیلگر حقوقی خبره هستید. متن زیر را خلاصه کرده و اقرارهای کلیدی، نکات مورد اختلاف، موضوعات اصلی و موارد قابل پیگیری را مشخص کنید. خروجی را با عناوین واضح ساختاردهی کنید. متن: '{text}'",
        textLabel: "متن برای خلاصه",
        textPlaceholder: "متن کامل صورت‌جلسه یا سند حقوقی را اینجا وارد کنید...",
        buttonText: "خلاصه کن",
        summarizing: "در حال خلاصه سازی...",
        resultsTitle: "خلاصه",
        validationError: "لطفا متنی برای خلاصه کردن وارد کنید.",
        tryExample: "یا یک نمونه را امتحان کنید:",
        examples: [
          { label: "اظهارات شاهد", text: "من ساعت حدود ۲:۱۵ بعد از ظهر روز سه‌شنبه در تقاطع خیابان اصلی و اول بودم. چراغ برای تردد شمال به جنوب سبز بود. من دیدم که خودروی قرمز، یک سدان، بدون توقف از تقاطع عبور کرد. آن با کامیون آبی که از لاین جنوب به شمال در حال گردش به چپ بود، برخورد کرد. قبل از برخورد صدای بوقی نشنیدم." }
        ]
    },
    eDiscoveryHelper: {
        title: "دستیار کلیدواژه کشف الکترونیکی",
        subtitle: "پرونده خود را شرح دهید تا کلیدواژه‌ها و عبارات مؤثری برای کشف الکترونیکی اسناد ایجاد شود.",
        prompt: "شما یک متخصص پشتیبانی دعاوی خبره هستید. بر اساس شرح پرونده زیر، یک لیست ساختاریافته از کلیدواژه‌ها برای کشف الکترونیکی ایجاد کنید. شرح پرونده: '{caseDesc}'",
        caseDescLabel: "شرح پرونده",
        caseDescPlaceholder: "خلاصه‌ای از پرونده، شامل افراد کلیدی، رویدادها، تاریخ‌ها و مفاهیم اصلی را ارائه دهید...",
        buttonText: "تولید کلیدواژه‌ها",
        generating: "در حال تولید...",
        resultsTitle: "کلیدواژه‌های پیشنهادی برای کشف الکترونیکی",
        validationError: "لطفا شرح پرونده را وارد کنید.",
        copyAll: "کپی همه",
        copied: "کپی شد!",
        categories: {
            keyPeople: "اشخاص و نهادهای کلیدی",
            keyConcepts: "مفاهیم و اصطلاحات کلیدی",
            dateRanges: "محدوده‌های زمانی و تاریخ‌های احتمالی",
            booleanPhrases: "عبارات جستجوی پیشرفته"
        },
        tryExample: "یا یک نمونه را امتحان کنید:",
        examples: [
          { label: "اختلاف قراردادی", caseDesc: "یک پرونده نقض قرارداد بین 'شرکت نوآوران' و 'شرکت تامین‌کننده' در مورد تاخیر در تحویل میکروچیپ‌های سفارشی برای محصولی با نام رمز 'پروژه ققنوس'. افراد کلیدی مدیرعامل خانم سارا احمدی (نوآوران) و مدیر حساب آقای علی محمدی (تامین‌کننده) هستند. دوره زمانی اصلی مورد نظر از ژانویه تا ژوئن ۲۰۲۳ است." }
        ]
    }
};