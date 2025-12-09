/// <reference lib="es2015" />

export type ContactFormConfig = {
  serviceId: string | null;
  publicKey: string | null;
  ownerTemplateId: string | null;
  userTemplateId: string | null;
  toEmail: string;
};

type NotificationType = "success" | "error";

type EmailPayload = {
  name: string;
  email: string;
  message: string;
};

function showNotification(notification: HTMLElement | null, message: string, type: NotificationType) {
  if (!notification) return;

  notification.textContent = message;
  notification.className = `notification notification-${type}`;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 4000);
}

function setSubmitting(form: HTMLFormElement, isSubmitting: boolean) {
  const button = form.querySelector<HTMLButtonElement>(".submit-button");
  const text = button?.querySelector<HTMLSpanElement>(".button-text");
  if (!button) return;

  button.disabled = isSubmitting;
  if (text) {
    text.textContent = isSubmitting ? "sending..." : "send message";
  }
}

async function sendEmail(
  payload: EmailPayload,
  config: ContactFormConfig
): Promise<void> {
  const { serviceId, publicKey, ownerTemplateId, userTemplateId, toEmail } = config;
  if (!serviceId || !publicKey) {
    throw new Error("Email service is not configured yet.");
  }

  const basePayload = {
    service_id: serviceId,
    user_id: publicKey,
  };

  const requests: Promise<Response>[] = [];

  if (ownerTemplateId) {
    requests.push(
      fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...basePayload,
          template_id: ownerTemplateId,
          template_params: {
            from_name: payload.name,
            reply_to: payload.email,
            message: payload.message,
            email: toEmail,
            to_email: toEmail,
            user_email: payload.email,
          },
        }),
      })
    );
  }

  if (userTemplateId) {
    requests.push(
      fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...basePayload,
          template_id: userTemplateId,
          template_params: {
            from_name: "Aarav",
            reply_to: toEmail,
            message: payload.message,
            email: payload.email,
            to_email: payload.email,
          },
        }),
      })
    );
  }

  if (!requests.length) {
    throw new Error("No EmailJS templates configured.");
  }

  const responses = await Promise.all(requests);
  const failure = responses.find((response) => !response.ok);
  if (failure) {
    const errorText = await failure.text();
    throw new Error(errorText || "EmailJS send failed");
  }
}

export function initContactForm(
  form: HTMLFormElement | null,
  notification: HTMLElement | null,
  config: ContactFormConfig
) {
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!config.serviceId || !config.publicKey) {
      showNotification(
        notification,
        "Email service is not configured yet. Please add PUBLIC_EMAILJS_SERVICE_ID and PUBLIC_EMAILJS_PUBLIC_KEY.",
        "error"
      );
      return;
    }

    setSubmitting(form, true);

    const formData = new FormData(form);
    const name = (formData.get("name")?.toString() || "").trim();
    const email = (formData.get("email")?.toString() || "").trim();
    const message = (formData.get("message")?.toString() || "").trim();

    if (!name || !email || !message) {
      showNotification(notification, "Please fill in all fields before sending.", "error");
      setSubmitting(form, false);
      return;
    }

    try {
      await sendEmail({ name, email, message }, config);
      showNotification(notification, "Message sent successfully! I'll get back to you soon.", "success");
      form.reset();
    } catch (error) {
      console.error("Email send failed", error);
      showNotification(
        notification,
        "Could not send your message. Please try again or email me directly.",
        "error"
      );
    } finally {
      setSubmitting(form, false);
    }
  });
}
