const FIELD_LABELS = {
  name: "Name",
  email: "Email",
  password: "Password",
  oldPassword: "Current password",
  newPassword: "New password",
  otp: "Verification code",
  location: "Location",
};

const messageMap = [
  {
    match: /email already exists/i,
    message: "An account already exists with this email. Try logging in instead.",
  },
  {
    match: /user not found/i,
    message: "We could not find an account with those details. Please check and try again.",
  },
  {
    match: /invalid password/i,
    message: "The password you entered is incorrect.",
  },
  {
    match: /old password is incorrect/i,
    message: "Your current password is incorrect.",
  },
  {
    match: /invalid otp/i,
    message: "The verification code is incorrect. Please check it and try again.",
  },
  {
    match: /otp expired/i,
    message: "That verification code has expired. Please request a new one.",
  },
  {
    match: /resume not found/i,
    message: "We could not find that resume. Please return to the list and try again.",
  },
  {
    match: /only pdf files are allowed/i,
    message: "Please upload a PDF resume file.",
  },
  {
    match: /please select a pdf file/i,
    message: "Please choose a PDF file before uploading.",
  },
  {
    match: /something went wrong/i,
    message: "Something went wrong on our side. Please try again in a moment.",
  },
];

const getFriendlyMessage = (value, fallback) => {
  if (typeof value !== "string") return fallback;

  const trimmed = value.trim();
  if (!trimmed) return fallback;

  for (const entry of messageMap) {
    if (entry.match.test(trimmed)) {
      return entry.message;
    }
  }

  return fallback;
};

const formatValidationErrors = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;

  const entries = Object.entries(data)
    .map(([field, message]) => {
      const label = FIELD_LABELS[field] || field;
      if (!message) return null;
      if (typeof message === "string") {
        return `${label}: ${message}`;
      }
      return `${label}: Invalid value`;
    })
    .filter(Boolean);

  return entries.length ? entries.join(" ") : null;
};

export const getUserFriendlyErrorMessage = (err, fallback = "Please try again.") => {
  const status = err?.response?.status;
  const data = err?.response?.data;

  if (data && typeof data === "object" && !Array.isArray(data)) {
    if (data.message && typeof data.message === "string") {
      const mapped = getFriendlyMessage(data.message, null);
      if (mapped) return mapped;
      return data.message;
    }

    const validationMessage = formatValidationErrors(data);
    if (validationMessage) return validationMessage;
  }

  const rawMessage =
    (typeof data === "string" && data) ||
    (typeof err?.message === "string" && err.message) ||
    "";

  if (status === 401) {
    if (/invalid password/i.test(rawMessage)) {
      return "The password you entered is incorrect.";
    }
    return "We could not sign you in. Please check your email and password.";
  }

  if (status === 403) {
    return "You do not have permission to complete this action.";
  }

  if (status === 404) {
    return "We could not find the requested item. Please refresh and try again.";
  }

  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }

  if (status >= 500) {
    return "Something went wrong on our side. Please try again in a moment.";
  }

  const mapped = getFriendlyMessage(rawMessage, null);
  if (mapped) return mapped;

  return fallback;
};
