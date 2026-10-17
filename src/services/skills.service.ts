import {
  skillsRepository,
  type CreateSkillInput,
  type UpdateSkillInput,
} from "@/repositories/skills.repository";

export const skillsService = {
  async getAllSkills() {
    return skillsRepository.findAll();
  },

  async getSkillById(id: string) {
    if (!id) {
      throw new Error("Skill ID is required");
    }

    const skill = await skillsRepository.findById(id);

    if (!skill) {
      throw new Error("Skill not found");
    }

    return skill;
  },

  async createSkill(input: CreateSkillInput) {
    if (!input.name?.trim()) {
      throw new Error("Skill name is required");
    }

    if (!input.category?.trim()) {
      throw new Error("Skill category is required");
    }

    return skillsRepository.create({
      ...input,
      name: input.name.trim(),
      category: input.category.trim(),
    });
  },

  async updateSkill(
    id: string,
    input: UpdateSkillInput
  ) {
    if (!id) {
      throw new Error("Skill ID is required");
    }

    if (input.name !== undefined && !input.name.trim()) {
      throw new Error("Skill name cannot be empty");
    }

    if (
      input.category !== undefined &&
      !input.category.trim()
    ) {
      throw new Error("Skill category cannot be empty");
    }

    return skillsRepository.update(id, {
      ...input,
      ...(input.name !== undefined && {
        name: input.name.trim(),
      }),
      ...(input.category !== undefined && {
        category: input.category.trim(),
      }),
    });
  },

  async deleteSkill(id: string) {
    if (!id) {
      throw new Error("Skill ID is required");
    }

    await this.getSkillById(id);

    return skillsRepository.delete(id);
  },
};