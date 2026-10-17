import {
  projectsRepository,
  type CreateProjectInput,
  type UpdateProjectInput,
} from "@/repositories/projects.repository";

export const projectsService = {
  async getAllProjects() {
    return projectsRepository.findAll();
  },

  async getProjectById(id: string) {
    if (!id) {
      throw new Error("Project ID is required");
    }

    const project = await projectsRepository.findById(id);

    if (!project) {
      throw new Error("Project not found");
    }

    return project;
  },

  async createProject(input: CreateProjectInput) {
    if (input.project_section !== "web_app" && input.project_section !== "web_design") {
      throw new Error("Display Section must be Web App or Web Design");
    }
    if (!input.title?.trim()) {
      throw new Error("Project title is required");
    }

    if (!input.slug?.trim()) {
      throw new Error("Project slug is required");
    }

    if (!input.description?.trim()) {
      throw new Error("Project description is required");
    }

    if (await projectsRepository.findBySlug(input.slug.trim())) {
      throw new Error("A project with this slug already exists");
    }

    return projectsRepository.create({
      ...input,
      title: input.title.trim(),
      slug: input.slug.trim(),
      description: input.description.trim(),
    });
  },

  async updateProject(
    id: string,
    input: UpdateProjectInput
  ) {
    if (!id) {
      throw new Error("Project ID is required");
    }

    if (input.project_section !== undefined && input.project_section !== "web_app" && input.project_section !== "web_design") {
      throw new Error("Display Section must be Web App or Web Design");
    }

    if (input.title !== undefined && !input.title.trim()) {
      throw new Error("Project title cannot be empty");
    }

    if (input.slug !== undefined && !input.slug.trim()) {
      throw new Error("Project slug cannot be empty");
    }

    if (input.slug !== undefined) {
      const existing = await projectsRepository.findBySlug(input.slug.trim());
      if (existing && existing.id !== id) throw new Error("A project with this slug already exists");
    }

    return projectsRepository.update(id, {
      ...input,
      ...(input.title !== undefined && {
        title: input.title.trim(),
      }),
      ...(input.slug !== undefined && {
        slug: input.slug.trim(),
      }),
    });
  },

  async deleteProject(id: string) {
    if (!id) {
      throw new Error("Project ID is required");
    }

    await this.getProjectById(id);

    return projectsRepository.delete(id);
  },
};
