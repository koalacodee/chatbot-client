export const LOCALES_MAP = {
  ar: "ar.json",
  de: "de.json",
  en: "en.json",
  es: "es.json",
  fr: "fr.json",
  ja: "ja.json",
  pt: "pt.json",
  ru: "ru.json",
  tr: "tr.json",
  zh: "zh.json",
};

export type CommonLocales = {
  welcome: {
    title: string;
    description: string;
  };
  categories: {
    title: string;
  };
  tickets: {
    title: string;
    description: string;
    ticket_verified: string;
    ticket_verified_description: string;
    ticket_verified_error: string;
    reference_number: string;
    no_tickets: string;
    no_attachments: string;
    form: {
      labels: {
        main_topic: string;
        specific_issue: string;
        full_name: string;
        email_address: string;
        phone_number: string;
        subject: string;
        description: string;
        submit: string;
        attachments: string;
        attachments_max: string;
        choose_file: string;
        no_specific_issue: string;
      };
      placeholders: {
        main_topic: string;
        specific_issue: string;
        full_name: string;
        email_address: string;
        phone_number: string;
        subject: string;
        description: string;
      };
      validation: {
        please_select_main_topic: string;
        please_enter_valid_phone: string;
        please_enter_valid_email: string;
      };
      errors: {
        failed_to_load_departments: string;
      };
    };
  };
  faqs: {
    was_this_helpful: string;
    thanks_for_your_feedback: string;
    quick_questions: string;
    no_questions_available: string;
    was_this_reply_helpful: string;
    satisfied: string;
    dissatisfied: string;
  };
  ui: {
    loading: string;
    submitting: string;
    choose_files: string;
    select_language: string;
    refresh: string;
    track: string;
    track_your_tickets: string;
    enter_ticket_code: string;
    current_ticket: string;
    ticket_details: string;
    close_modal: string;
    status: string;
    created: string;
    question: string;
    answer: string;
    no_question_provided: string;
    code: string;
    failed_to_load_ticket_url: string;
    failed_to_load_saved_ticket: string;
    failed_to_track_ticket: string;
    failed_to_refresh_ticket: string;
    support_reply: string;
    attachments: string;
    loading_preview: string;
    preview_not_available: string;
    download_file: string;
    verify_your_ticket: string;
    verification_code_sent: string;
    verification_code: string;
    verifying: string;
    verify_ticket: string;
    didnt_receive_code: string;
    resend: string;
    invalid_verification_code: string;
  };
  common: {
    yes: string;
    no: string;
    loading: string;
    submitting: string;
  };
};
