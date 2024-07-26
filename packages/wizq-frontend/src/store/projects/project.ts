import { rootApi } from '../api';
import {
  CreateProject,
  CreateProjectResponse,
  LoadProjectResponse,
  ProjectInformationData,
  UpdateProjectRequestData,
  ProjectInitialState,
  SuggestedSkillsResponse,
} from '../../types/project';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ApiResponse } from '../../types/api';
import { RootState } from '../index';
import { type Option } from '../../types';
import { LENGTH_UNITS } from '../../utils/createProject';
import { ProjectProposal } from '../../types/proposal';

export const projectApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query({
      query: () => 'project',
      providesTags: () => [{ type: 'AllProjects' }],
    }),
    getProjectsByAuthId: build.query<LoadProjectResponse[], string>({
      query: (id) => `project/author/${id}`,
      providesTags: () => [{ type: 'AllProjects' }],
    }),
    deleteProject: build.mutation<SuggestedSkillsResponse, string>({
      query: (id) => ({
        url: `project/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [{ type: 'AllProjects' }],
    }),
    getSkills: build.query<Option[], null>({ query: () => 'skills' }),
    getSelectedProject: build.query<LoadProjectResponse, string>({
      query: (id) => `/project/${id}`,
      providesTags: (result, error, arg) => [{ type: 'Project', id: arg }],
    }),
    getProposalsByProject: build.query<ProjectProposal[], void>({ query: () => 'proposals' }),
    createSuggestedSkills: build.mutation<SuggestedSkillsResponse, string>({
      query: (description) => ({
        url: 'skills/suggest',
        method: 'POST',
        body: { description },
      }),
    }),
    deleteFileFromProject: build.mutation<CreateProjectResponse, string>({
      query: (id) => ({
        url: `project/file/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Project', id: (result as CreateProjectResponse).id }],
    }),
    updateProjectInformation: build.mutation<
      ApiResponse<CreateProjectResponse> | unknown,
      { formData: Partial<CreateProject>; id: string }
    >({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        if (_arg.formData.files) {
          const req = new FormData();
          for (const item of _arg.formData.files) {
            if (item instanceof File) {
              req.append('file', item as Blob);
            }
          }
          await fetchWithBQ({
            method: 'PATCH',
            url: `project/${_arg.id}`,
            body: req,
          });
        }
        delete _arg.formData.authorId;
        delete _arg.formData.files;
        const categories = _arg.formData.categories ? _arg.formData.categories.map((item) => item.id) : null;
        const skills = _arg.formData.skills ? _arg.formData.skills.map((item) => item.id) : null;
        const projectTasks = _arg.formData.project_tasks
          ? _arg.formData.project_tasks.map((item) => ({
              projectId: _arg.id,
              name: item.name,
            }))
          : null;

        const requestBody: Partial<UpdateProjectRequestData> = {
          ..._arg.formData,
          categories,
          skills,
          project_tasks: projectTasks,
        };

        if (!_arg.formData.categories) {
          delete requestBody.categories;
        }
        if (!_arg.formData.skills) {
          delete requestBody.skills;
        }
        if (!_arg.formData.project_tasks) {
          delete requestBody.project_tasks;
        }

        const response = await fetchWithBQ({
          method: 'PATCH',
          url: `project/${_arg.id}`,
          body: requestBody,
        });

        if (response.error) {
          throw new Error(response.error as unknown as string);
        }

        return { data: response.data };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Project', id: arg.id }],
    }),
    createNewProject: build.mutation<ApiResponse<CreateProjectResponse> | unknown, ProjectInformationData>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const req = new FormData();
        const state = _queryApi.getState() as RootState;

        for (const item of _arg.files) {
          if (item instanceof File) {
            req.append('file', item as Blob);
          }
        }
        req.append('authorId', state.auth.user.id);
        req.append('name', _arg.name);

        const response = await fetchWithBQ({
          method: 'POST',
          url: 'project/create',
          body: req,
        });

        if (response.error) {
          throw new Error(response.error as unknown as string);
        }

        const data = response.data as CreateProjectResponse;
        delete _arg.files;
        await _queryApi.dispatch(
          projectApi.endpoints.updateProjectInformation.initiate({ formData: _arg, id: data.id })
        );
        await _queryApi.dispatch(projectApi.endpoints.getSelectedProject.initiate(data.id));

        return { data: response.data };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Project', id: (result as CreateProjectResponse).id }],
    }),
    setInviteDesigner: build.mutation<
      ApiResponse<void> | unknown,
      { authorId: string; projectId: string; providerId: string }
    >({
      query: ({ authorId, projectId, providerId }) => ({
        url: 'project/invite',
        method: 'POST',
        body: { authorId, projectId, providerId },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Project', id: arg.projectId }, { type: 'MyUser' }],
    }),
    setInviteWithdrawDesigner: build.mutation<
      ApiResponse<void> | unknown,
      { authorId: string; projectId: string; providerId: string }
    >({
      query: ({ authorId, projectId, providerId }) => ({
        url: 'project/invite/withdraw',
        method: 'POST',
        body: { authorId, projectId, providerId },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Project', id: arg.projectId }, { type: 'MyUser' }],
    }),
  }),
});

const defaultSelectedProject: CreateProject = {
  id: '',
  name: '',
  address: '',
  files: [],
  categories: [],
  description: '',
  dimensions: {
    length: 0,
    width: 0,
    result: 0,
    unit: LENGTH_UNITS[0].value,
  },
  is_private: true,
  start_date: '',
  floor_plan: '',
  skill_level: '',
  skills: [],
  project_tasks: [],
  max_budget: '2000000',
  min_budget: '1',
  proposals: [],
  matched: [],
  contacted: [],
};

const initialState: ProjectInitialState = {
  selectedProject: defaultSelectedProject,
  selectedProjectId: '',
  suggestedSkills: [],
  selectedProposal: null,
  manageSPTab: 'Matched',
  createProjectStep: 1,
  isReviewing: false,
};

export const project = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setCreateProjectStep: (state, action: PayloadAction<number>) => {
      state.createProjectStep = action.payload;
    },
    setIsReviewing: (state, action: PayloadAction<boolean>) => {
      state.isReviewing = action.payload;
    },
    setSelectedProposal: (state, action: PayloadAction<ProjectProposal['id']>) => {
      if (action.payload == null) {
        document.body.classList.remove('locked');
      } else {
        document.body.classList.add('locked');
      }
      state.selectedProposal = action.payload;
    },
    setManageSPTab: (state, action: PayloadAction<string>) => {
      state.manageSPTab = action.payload;
    },
    resetSelectedProjectState: (state) => {
      state.selectedProject = defaultSelectedProject;
    },
    setSelectedProject: (state, action: PayloadAction<LoadProjectResponse>) => {
      state.selectedProject = { ...state.selectedProject, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(projectApi.endpoints.createSuggestedSkills.matchFulfilled, (state, action) => {
      state.selectedProject = { ...state.selectedProject, skills: action.payload.preselectedSkills };
      state.suggestedSkills = action.payload.suggestedSkills;
    });
    builder.addMatcher(projectApi.endpoints.getSelectedProject.matchFulfilled, (state, action) => {
      state.selectedProject = {
        id: action.payload.id,
        name: action.payload.name,
        description: action.payload.description,
        address: action.payload.address,
        dimensions: action.payload.dimensions,
        start_date: action.payload.start_date,
        is_private: action.payload.is_private,
        categories: action.payload.categories,
        project_tasks: action.payload.tasks,
        max_budget: action.payload.max_budget ? action.payload.max_budget : '2000000',
        min_budget: action.payload.min_budget ? action.payload.min_budget : '1',
        skills: action.payload.skills,
        skill_level: action.payload.skill_level,
        floor_plan: action.payload.floor_plan,
        files: action.payload.files,
        proposals: action.payload.proposals,
        matched: action.payload.matched,
        contacted: action.payload.contacted,
      };
    });
  },
});

export const { setSelectedProposal, setManageSPTab, resetSelectedProjectState, setCreateProjectStep, setIsReviewing } =
  project.actions;

export const {
  useGetProjectsQuery,
  useGetSkillsQuery,
  useGetSelectedProjectQuery,
  useCreateNewProjectMutation,
  useUpdateProjectInformationMutation,
  useDeleteFileFromProjectMutation,
  useCreateSuggestedSkillsMutation,
  useGetProjectsByAuthIdQuery,
  useSetInviteDesignerMutation,
  useSetInviteWithdrawDesignerMutation,
  useDeleteProjectMutation,
} = projectApi;
