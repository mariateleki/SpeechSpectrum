const DEMOGRAPHICS = [
  {
    id: "demo_education",
    type: "multiple_choice",
    text: "What is the highest level of education you have completed?",
    options: [
      "High school diploma or GED",
      "Some college",
      "Bachelor's degree",
      "Graduate or professional degree",
      "Prefer not to say"
    ]
  },
  {
    id: "demo_gender",
    type: "multiple_choice_with_other",
    text: "What is your gender?",
    options: [
      "Man",
      "Woman",
      "Non-binary",
      { value: "Prefer to self-describe", self_describe: true },
      "Prefer not to say"
    ]
  },
  {
    id: "demo_race",
    type: "multi_select_with_other",
    text: "What is your race or ethnicity? (Select all that apply)",
    options: [
      "American Indian or Alaska Native",
      "Asian or Asian American",
      "Black or African American",
      "Hispanic or Latino/a/x",
      "Middle Eastern or North African",
      "Native Hawaiian or Pacific Islander",
      "White or European American",
      "Multiracial",
      { value: "Prefer to self-describe", self_describe: true },
      "Prefer not to say"
    ]
  },
  {
    id: "demo_occupation",
    type: "multiple_choice",
    text: "Which occupation domain most closely matches your current work?",
    options: [
      "Legal",
      "Technology or Engineering",
      "Healthcare or Medical",
      "Business or Management",
      "Other"
    ]
  },
  {
    id: "demo_transcripts_in_work",
    type: "multiple_choice",
    text: "Does your work regularly involve reading transcripts or written records of spoken interaction? (e.g. meeting minutes, deposition transcripts, clinical notes, call logs)",
    options: [
      "Yes, it's a core part of my job",
      "Occasionally — a few times a month or less",
      "Rarely or never"
    ]
  },
  {
    id: "demo_voice_tech_frequency",
    type: "multiple_choice",
    text: "How often do you use voice or speech technology in your daily life or work? (e.g. voice assistants, dictation, auto-captions)",
    options: [
      "Multiple times a day",
      "About once a day",
      "A few times a week",
      "About once a week",
      "Rarely or never"
    ]
  },
  {
    id: "demo_voice_tech_accuracy",
    type: "multiple_choice",
    text: "For the voice technology you use most often: how accurate do you find it?",
    options: [
      "1 — Very inaccurate",
      "2",
      "3",
      "4",
      "5 — Highly accurate",
      "I don't use voice technology"
    ]
  },
  {
    id: "demo_parole_experience",
    type: "multi_select",
    text: "Do you have any prior experience with parole or pardon hearings? (Select all that apply)",
    options: [
      "Yes — as a defendant, applicant, or someone with a hearing of my own",
      "Yes — as a family member, friend, or supporter of someone with a hearing",
      "Yes — as a victim or affected party in a hearing",
      "Yes — through jury duty or as a court observer",
      "Yes — as part of my work (e.g., legal, corrections, advocacy, research)",
      "Yes — through news coverage, podcasts, or documentaries",
      "No — I have no prior experience with parole or pardon hearings",
      "Prefer not to say"
    ]
  },
  {
    id: "demo_us_state",
    type: "dropdown",
    text: "Which U.S. state or territory do you currently live in?",
    options: [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
      "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
      "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
      "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
      "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
      "New Hampshire", "New Jersey", "New Mexico", "New York",
      "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
      "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
      "West Virginia", "Wisconsin", "Wyoming",
      "District of Columbia", "American Samoa", "Guam",
      "Northern Mariana Islands", "Puerto Rico", "U.S. Virgin Islands",
      "I do not live in the United States",
      "Prefer not to say"
    ]
  }
];
