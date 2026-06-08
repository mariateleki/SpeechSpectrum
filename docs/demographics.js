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
    // Options mirror Prolific's `employment-sector` filter (21 choices) so we
    // can join responses across the two sources later. See
    // notebooks/prolific_filters_explorer.ipynb to refresh.
    text: "Which of the following best describes the sector you primarily work in?",
    options: [
      "Agriculture, Food and Natural Resources",
      "Architecture and Construction",
      "Arts",
      "Business Management & Administration",
      "Education & Training",
      "Finance",
      "Government & Public Administration",
      "Medicine",
      "Hospitality & Tourism",
      "Information Technology",
      "Legal",
      "Policing",
      "Military",
      "Manufacturing",
      "Marketing & Sales",
      "Retail",
      "Science, Technology, Engineering & Mathematics",
      "Social Sciences",
      "Transportation, Distribution & Logistics",
      "Other",
      "Rather not say"
    ]
  },
  {
    id: "demo_transcripts_in_work",
    type: "multiple_choice",
    text: "In your work, do you ever read written records of conversations or spoken exchanges in order to make a judgment or decision about what happened or what was said?",
    options: [
      "Yes, regularly — it's a part of my professional role",
      "Yes, occasionally — as part of research, annotation, or other tasks",
      "Rarely or never"
    ]
  },
  {
    id: "demo_voice_tech_frequency",
    type: "multiple_choice",
    text: "How often do you use automatic speech or voice features — for example, Siri, Google Assistant, Zoom auto-captions, or phone voice commands — in your daily life or work?",
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
