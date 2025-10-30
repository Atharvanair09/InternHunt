const mentors = [
  {
    mentor_name: "Dr. Priya Mehta",
    email: "priya.mehta@microsoft.com",
    number: "+91 9876543210",
    designation: "Lead Data Scientist",
    company_name: "Microsoft",
    mentor_image: "https://example.com/images/priya_mehta.jpg",
    expertise_areas: ["Machine Learning", "Natural Language Processing", "Data Science"],
    years_of_experience: 10,
    bio: "Dr. Priya is an experienced data scientist specializing in NLP and AI-powered analytics at Microsoft."
  },
  {
    mentor_name: "Mr. Rajesh Iyer",
    email: "rajesh.iyer@google.com",
    number: "+91 9988776655",
    designation: "Senior AI Engineer",
    company_name: "Google",
    mentor_image: "https://example.com/images/rajesh_iyer.jpg",
    expertise_areas: ["Artificial Intelligence", "Deep Learning", "Speech Recognition"],
    years_of_experience: 8,
    bio: "Rajesh has led several AI-based projects at Google focused on conversational agents and speech analysis."
  },
  {
    mentor_name: "Ms. Neha Kapoor",
    email: "neha.kapoor@capgemini.com",
    number: "+91 9123456789",
    designation: "Full Stack Developer",
    company_name: "Capgemini",
    mentor_image: "https://example.com/images/neha_kapoor.jpg",
    expertise_areas: ["MERN Stack", "Cloud Architecture", "API Development"],
    years_of_experience: 7,
    bio: "Neha is a passionate full-stack developer with experience in scalable web apps and AWS cloud integrations."
  },
  {
    mentor_name: "Dr. Sanjay Kulkarni",
    email: "sanjay.kulkarni@google.com",
    number: "+91 9812345678",
    designation: "Chief Software Architect",
    company_name: "Google",
    mentor_image: "https://example.com/images/sanjay_kulkarni.jpg",
    expertise_areas: ["Software Architecture", "Healthcare Systems", "Microservices"],
    years_of_experience: 15,
    bio: "Sanjay specializes in large-scale healthcare applications and enterprise software systems."
  },
  {
    mentor_name: "Mrs. Kavita Sharma",
    email: "kavita.sharma@tcs.com",
    number: "+91 9001122334",
    designation: "Education Technology Specialist",
    company_name: "TCS",
    mentor_image: "https://example.com/images/kavita_sharma.jpg",
    expertise_areas: ["EdTech", "Realtime Communication", "Frontend Development"],
    years_of_experience: 9,
    bio: "Kavita designs interactive education platforms using real-time data and modern web technologies."
  },
  {
    mentor_name: "Mr. Arjun Deshmukh",
    email: "arjun.deshmukh@google.com",
    number: "+91 9822334455",
    designation: "Transportation Data Scientist",
    company_name: "Google",
    mentor_image: "https://example.com/images/arjun_deshmukh.jpg",
    expertise_areas: ["Data Analytics", "AI Optimization", "Smart Logistics"],
    years_of_experience: 11,
    bio: "Arjun leads AI-based route optimization projects for sustainable transportation systems."
  },
  {
    mentor_name: "Ms. Riya Patel",
    email: "riya.patel@meta.com",
    number: "+91 9033445566",
    designation: "Financial Software Engineer",
    company_name: "Meta",
    mentor_image: "https://example.com/images/riya_patel.jpg",
    expertise_areas: ["FinTech", "Data Visualization", "Web Security"],
    years_of_experience: 6,
    bio: "Riya is a financial software expert focused on secure and insightful digital finance platforms."
  },
  {
    mentor_name: "Dr. Sneha Reddy",
    email: "sneha.reddy@google.com",
    number: "+91 9911223344",
    designation: "Agritech Research Engineer",
    company_name: "Google",
    mentor_image: "https://example.com/images/sneha_reddy.jpg",
    expertise_areas: ["IoT", "Data Science", "Precision Agriculture"],
    years_of_experience: 12,
    bio: "Sneha applies IoT and analytics to improve agricultural productivity and sustainability."
  },
  {
    mentor_name: "Mr. Manish Bhatt",
    email: "manish.bhatt@capgemini.com",
    number: "+91 9700112233",
    designation: "AI Systems Architect",
    company_name: "Capgemini",
    mentor_image: "https://example.com/images/manish_bhatt.jpg",
    expertise_areas: ["Recommendation Systems", "Backend Engineering", "TensorFlow"],
    years_of_experience: 9,
    bio: "Manish architects AI-driven recommendation systems for leading e-commerce clients."
  },
  {
    mentor_name: "Dr. Nikhil Bansal",
    email: "nikhil.bansal@tcs.com",
    number: "+91 9877766554",
    designation: "IoT Systems Expert",
    company_name: "TCS",
    mentor_image: "https://example.com/images/nikhil_bansal.jpg",
    expertise_areas: ["IoT", "Data Visualization", "Smart Cities"],
    years_of_experience: 14,
    bio: "Nikhil has extensive experience developing real-time monitoring systems for urban infrastructure."
  },
  {
    mentor_name: "Ms. Tanya Rao",
    email: "tanya.rao@google.com",
    number: "+91 9955446677",
    designation: "Health Data Analyst",
    company_name: "Google",
    mentor_image: "https://example.com/images/tanya_rao.jpg",
    expertise_areas: ["Healthcare Analytics", "TensorFlow", "Mobile Applications"],
    years_of_experience: 7,
    bio: "Tanya merges healthcare and AI to create intelligent fitness and wellness applications."
  },
  {
    mentor_name: "Dr. Ananya Bose",
    email: "ananya.bose@google.com",
    number: "+91 9788996655",
    designation: "Computer Vision Specialist",
    company_name: "Google",
    mentor_image: "https://example.com/images/ananya_bose.jpg",
    expertise_areas: ["Computer Vision", "Image Recognition", "AI"],
    years_of_experience: 10,
    bio: "Ananya is an expert in computer vision and AI-driven health and nutrition applications."
  },
  {
    mentor_name: "Mr. Aditya Menon",
    email: "aditya.menon@google.com",
    number: "+91 9123456677",
    designation: "Cybersecurity Engineer",
    company_name: "Google",
    mentor_image: "https://example.com/images/aditya_menon.jpg",
    expertise_areas: ["Cybersecurity", "Machine Learning", "Network Security"],
    years_of_experience: 11,
    bio: "Aditya specializes in ML-powered threat detection and real-time network defense systems."
  },
  {
    mentor_name: "Ms. Meera Jain",
    email: "meera.jain@microsoft.com",
    number: "+91 9777665544",
    designation: "AI Accessibility Engineer",
    company_name: "Microsoft",
    mentor_image: "https://example.com/images/meera_jain.jpg",
    expertise_areas: ["Accessibility", "AI Systems", "Frontend Development"],
    years_of_experience: 8,
    bio: "Meera designs accessible AI tools that enhance digital usability for differently-abled users."
  },
  {
    mentor_name: "Mr. Rohit Sinha",
    email: "rohit.sinha@amazon.com",
    number: "+91 9900112234",
    designation: "Senior Software Engineer",
    company_name: "Amazon",
    mentor_image: "https://example.com/images/rohit_sinha.jpg",
    expertise_areas: ["API Integration", "TravelTech", "Data Engineering"],
    years_of_experience: 9,
    bio: "Rohit builds travel recommendation engines and scalable cloud-based APIs at Amazon."
  },
  {
    mentor_name: "Dr. Varun Joshi",
    email: "varun.joshi@amazon.com",
    number: "+91 9334455566",
    designation: "Video Systems Architect",
    company_name: "Amazon",
    mentor_image: "https://example.com/images/varun_joshi.jpg",
    expertise_areas: ["WebRTC", "Video Streaming", "Cloud Infrastructure"],
    years_of_experience: 13,
    bio: "Varun is an architect with deep expertise in cloud video systems and real-time collaboration tools."
  },
  {
    mentor_name: "Ms. Ishita Das",
    email: "ishita.das@google.com",
    number: "+91 9012233445",
    designation: "Product Data Analyst",
    company_name: "Google",
    mentor_image: "https://example.com/images/ishita_das.jpg",
    expertise_areas: ["Data Analytics", "Product Management", "Visualization"],
    years_of_experience: 6,
    bio: "Ishita combines analytics and UX insights to guide data-driven product strategies."
  },
  {
    mentor_name: "Mr. Karan Malhotra",
    email: "karan.malhotra@meta.com",
    number: "+91 9023445566",
    designation: "Frontend Engineering Lead",
    company_name: "Meta",
    mentor_image: "https://example.com/images/karan_malhotra.jpg",
    expertise_areas: ["React", "Next.js", "UI/UX"],
    years_of_experience: 8,
    bio: "Karan leads frontend teams at Meta, focusing on performance optimization and user experience."
  },
  {
    mentor_name: "Dr. Deepika Nair",
    email: "deepika.nair@microsoft.com",
    number: "+91 8899776655",
    designation: "AI Research Scientist",
    company_name: "Microsoft",
    mentor_image: "https://example.com/images/deepika_nair.jpg",
    expertise_areas: ["AI Ethics", "Deep Learning", "Language Models"],
    years_of_experience: 12,
    bio: "Deepika works on ethical AI model design and applied machine learning research at Microsoft."
  },
  {
    mentor_name: "Mr. Anil Varma",
    email: "anil.varma@capgemini.com",
    number: "+91 9344556677",
    designation: "DevOps Specialist",
    company_name: "Capgemini",
    mentor_image: "https://example.com/images/anil_varma.jpg",
    expertise_areas: ["CI/CD", "AWS", "Kubernetes"],
    years_of_experience: 10,
    bio: "Anil helps enterprises streamline deployment pipelines and cloud infrastructure management."
  },
  {
    mentor_name: "Dr. Shalini Gupta",
    email: "shalini.gupta@tcs.com",
    number: "+91 9009988776",
    designation: "Big Data Engineer",
    company_name: "TCS",
    mentor_image: "https://example.com/images/shalini_gupta.jpg",
    expertise_areas: ["Big Data", "Spark", "Cloud Databases"],
    years_of_experience: 11,
    bio: "Shalini specializes in distributed computing and scalable big data processing frameworks."
  },
  {
    mentor_name: "Mr. Harshad Kulkarni",
    email: "harshad.kulkarni@amazon.com",
    number: "+91 8899223344",
    designation: "Cloud Solutions Architect",
    company_name: "Amazon",
    mentor_image: "https://example.com/images/harshad_kulkarni.jpg",
    expertise_areas: ["AWS", "Serverless Computing", "Microservices"],
    years_of_experience: 9,
    bio: "Harshad designs reliable, cost-efficient serverless architectures for enterprise clients."
  },
  {
    mentor_name: "Ms. Aditi Rao",
    email: "aditi.rao@meta.com",
    number: "+91 8999112233",
    designation: "UX Researcher",
    company_name: "Meta",
    mentor_image: "https://example.com/images/aditi_rao.jpg",
    expertise_areas: ["UX Research", "Accessibility", "Design Thinking"],
    years_of_experience: 7,
    bio: "Aditi conducts user research to make digital experiences inclusive and intuitive."
  },
  {
    mentor_name: "Mr. Ramesh Pillai",
    email: "ramesh.pillai@tcs.com",
    number: "+91 9011223344",
    designation: "AI Infrastructure Engineer",
    company_name: "TCS",
    mentor_image: "https://example.com/images/ramesh_pillai.jpg",
    expertise_areas: ["ML Infrastructure", "Cloud AI", "Automation"],
    years_of_experience: 10,
    bio: "Ramesh ensures high-performance AI pipelines and reliable deployment systems for enterprises."
  },
  {
    mentor_name: "Dr. Nita Fernandes",
    email: "nita.fernandes@microsoft.com",
    number: "+91 9888776655",
    designation: "Cloud Data Engineer",
    company_name: "Microsoft",
    mentor_image: "https://example.com/images/nita_fernandes.jpg",
    expertise_areas: ["Azure", "Data Warehousing", "ETL Pipelines"],
    years_of_experience: 13,
    bio: "Nita builds secure, large-scale cloud data ecosystems for global clients."
  }
];

module.exports = { mentors };
