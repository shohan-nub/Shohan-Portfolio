import {
  messagesRepository,
  type CreateMessageInput,
} from "@/repositories/messages.repository";

export class MessageValidationError extends Error {}

export const messagesService = {
  async getAllMessages() {
    return messagesRepository.findAll();
  },

  async getMessageById(id: string) {
    if (!id) {
      throw new Error("Message ID is required");
    }

    const message = await messagesRepository.findById(id);

    if (!message) {
      throw new Error("Message not found");
    }

    return message;
  },

  async createMessage(input: CreateMessageInput) {
    const name = input.name?.trim();
    const email = input.email?.trim();
    const message = input.message?.trim();

    if (!name) {
      throw new MessageValidationError("Name is required");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new MessageValidationError("A valid email is required");
    }

    if (!message) {
      throw new MessageValidationError("Message is required");
    }

    if (name.length > 100 || email.length > 254) {
      throw new MessageValidationError("Name or email is too long");
    }

    if (message.length > 5000) {
      throw new MessageValidationError("Message is too long");
    }

    const subject = input.subject?.trim() || null;
    if (subject && subject.length > 160) throw new MessageValidationError("Subject must be 160 characters or fewer");

    return messagesRepository.create({
      name,
      email,
      subject,
      message,
    });
  },

  async markMessageAsRead(id: string) {
    if (!id) {
      throw new Error("Message ID is required");
    }

    await this.getMessageById(id);

    return messagesRepository.markAsRead(id);
  },

  async setMessageReadStatus(id: string, isRead: boolean) {
    if (!id) throw new Error("Message ID is required");
    await this.getMessageById(id);
    return messagesRepository.setReadStatus(id, isRead);
  },

  async deleteMessage(id: string) {
    if (!id) {
      throw new Error("Message ID is required");
    }

    await this.getMessageById(id);

    return messagesRepository.delete(id);
  },
};
