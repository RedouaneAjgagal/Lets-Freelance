import { createSlice } from "@reduxjs/toolkit";

type ProfileSkill = {
    id: string;
    value: string;
}

type ProfileSkills = {
    skills: ProfileSkill[]
}

const initialState: ProfileSkills = {
    skills: []
}

const profileSkills = createSlice({
    name: "profileSkills",
    initialState,
    reducers: {
        addSkill(state: ProfileSkills, action: { payload: ProfileSkill, type: string }) {
            state.skills = [...state.skills, action.payload];
            return state;
        },
        removeSkill(state: ProfileSkills, action: { payload: { skillId: string }, type: string }) {
            state.skills = state.skills.filter(skill => skill.id !== action.payload.skillId);
            return state;
        }
    }
});

export const profileSkillsAction = profileSkills.actions;
export default profileSkills.reducer;