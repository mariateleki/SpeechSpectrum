const DEMOGRAPHICS = [
  {
    id: "demo_consent_content",
    type: "multiple_choice",
    text: "Content notice: This study uses transcripts from real parole/pardon hearings. The material discusses serious crimes and may include references to violence, sexual assault, child endangerment, domestic abuse, and substance use. Do you consent to read this type of content?",
    options: ["I consent and wish to continue", "I do not consent — exit the study"]
  },
  {
    id: "demo_age",
    type: "multiple_choice",
    text: "What is your age range?",
    options: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]
  },
  {
    id: "demo_gender",
    type: "multiple_choice",
    text: "What is your gender?",
    options: ["Male", "Female", "Non-binary", "Prefer not to say"]
  },
  {
    id: "demo_race",
    type: "multiple_choice",
    text: "What is your race/ethnicity?",
    options: [
      "American Indian or Alaska Native",
      "Asian",
      "Black or African American",
      "Hispanic or Latino",
      "Native Hawaiian or Other Pacific Islander",
      "White",
      "Two or more races",
      "Other",
      "Prefer not to say"
    ]
  },
  {
    id: "demo_education",
    type: "multiple_choice",
    text: "What is your highest level of education?",
    options: ["High school or less", "Some college", "Bachelor's degree", "Master's degree", "Doctoral or professional degree"]
  },
  {
    id: "demo_english",
    type: "multiple_choice",
    text: "How would you rate your English fluency?",
    options: ["Native speaker", "Fluent (near-native)", "Advanced", "Intermediate", "Beginner"]
  },
  {
    id: "demo_transcription_exp",
    type: "multiple_choice",
    text: "How much experience do you have reading or working with transcripts?",
    options: ["None", "A little", "Some", "A lot", "It's part of my job"]
  },
  {
    id: "demo_industry",
    type: "multiple_choice",
    text: "Which of these best describes your professional or academic background?",
    options: [
      "Speech technology (e.g., speech recognition, NLP, audio/voice tools)",
      "Legal (e.g., law, court reporting, paralegal work)",
      "None of the above"
    ]
  }
];
