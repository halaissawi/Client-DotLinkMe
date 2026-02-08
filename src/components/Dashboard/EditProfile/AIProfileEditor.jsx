import React, { useState } from "react";
import {
  Sparkles,
  Briefcase,
  GraduationCap,
  Code,
  Eye,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;

export default function AIProfileEditor({ profile, onUpdate }) {
  const [localProfile, setLocalProfile] = useState({
    skills: profile.skills || [],
    experience: profile.experience || [],
    education: profile.education || [],
  });

  const [editingExperience, setEditingExperience] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingSkills, setEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const designConcept = profile.customProfileDesign?.designConcept;
  const colorPalette = profile.customProfileDesign?.colorPalette;

  // Save changes to backend
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/profiles/${profile.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          skills: localProfile.skills,
          experience: localProfile.experience,
          education: localProfile.education,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Changes Saved!",
          text: "Your profile content has been updated",
          timer: 2000,
          showConfirmButton: false,
        });
        if (onUpdate) onUpdate(data.data);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  // Regenerate design
  const handleRegenerateDesign = async () => {
    const result = await Swal.fire({
      title: "Regenerate Profile Design?",
      text: "This will create a new unique design while keeping your content",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8B5CF6",
      confirmButtonText: "Yes, Regenerate",
    });

    if (!result.isConfirmed) return;

    setRegenerating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/ai/regenerate-design`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profileData: profile,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "New Design Generated!",
          text: `Design: ${data.data.customDesign.designConcept?.name}`,
          confirmButtonColor: "#8B5CF6",
        });
        if (onUpdate) onUpdate(data.data);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Regeneration Failed",
        text: error.message,
      });
    } finally {
      setRegenerating(false);
    }
  };

  // Skills management
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setLocalProfile({
        ...localProfile,
        skills: [...localProfile.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    setLocalProfile({
      ...localProfile,
      skills: localProfile.skills.filter((_, i) => i !== index),
    });
  };

  // Experience management
  const handleSaveExperience = (exp, index) => {
    const newExperience = [...localProfile.experience];
    if (index >= 0) {
      newExperience[index] = exp;
    } else {
      newExperience.push(exp);
    }
    setLocalProfile({ ...localProfile, experience: newExperience });
    setEditingExperience(null);
  };

  const handleDeleteExperience = (index) => {
    setLocalProfile({
      ...localProfile,
      experience: localProfile.experience.filter((_, i) => i !== index),
    });
  };

  // Education management
  const handleSaveEducation = (edu, index) => {
    const newEducation = [...localProfile.education];
    if (index >= 0) {
      newEducation[index] = edu;
    } else {
      newEducation.push(edu);
    }
    setLocalProfile({ ...localProfile, education: newEducation });
    setEditingEducation(null);
  };

  const handleDeleteEducation = (index) => {
    setLocalProfile({
      ...localProfile,
      education: localProfile.education.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              AI Profile Content
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Edit your AI-generated profile content
          </p>
        </div>
        {/* <button
          onClick={handleRegenerateDesign}
          disabled={regenerating}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${regenerating ? "animate-spin" : ""}`}
          />
          {regenerating ? "Regenerating..." : "Regenerate Design"}
        </button> */}
      </div>

      {/* Design Info */}
      {designConcept && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-2">
            Current Design
          </h3>
          <p className="text-2xl font-bold text-purple-600 mb-2">
            {designConcept.name}
          </p>
          <p className="text-gray-700 text-sm mb-4">
            {designConcept.description}
          </p>

          {/* Color Palette */}
          {colorPalette && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">
                Color Palette:
              </p>
              <div className="flex gap-2">
                {Object.entries(colorPalette).map(([key, color]) => (
                  <div
                    key={key}
                    className="w-10 h-10 rounded-lg shadow-md border-2 border-white"
                    style={{ backgroundColor: color }}
                    title={key}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skills Section */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg">Skills</h3>
          </div>
          <button
            onClick={() => setEditingSkills(!editingSkills)}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            {editingSkills ? "Done" : "Edit"}
          </button>
        </div>

        {editingSkills && (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
              placeholder="Add a skill..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {localProfile.skills.map((skill, index) => (
            <div
              key={index}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium text-sm flex items-center gap-2 group"
            >
              {skill}
              {editingSkills && (
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {localProfile.skills.length === 0 && (
            <p className="text-gray-500 text-sm">No skills added yet</p>
          )}
        </div>
      </div>

      {/* Experience Section */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-lg">Experience</h3>
          </div>
          <button
            onClick={() =>
              setEditingExperience({
                company: "",
                role: "",
                duration: "",
                description: "",
              })
            }
            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        <div className="space-y-3">
          {localProfile.experience.map((exp, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{exp.role}</p>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500">{exp.duration}</p>
                  {exp.description && (
                    <p className="text-sm text-gray-700 mt-2">
                      {exp.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingExperience({ ...exp, index })}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(index)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {localProfile.experience.length === 0 && (
            <p className="text-gray-500 text-sm">No experience added yet</p>
          )}
        </div>
      </div>

      {/* Education Section */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-lg">Education</h3>
          </div>
          <button
            onClick={() =>
              setEditingEducation({ institution: "", degree: "", year: "" })
            }
            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        <div className="space-y-3">
          {localProfile.education.map((edu, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{edu.degree}</p>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.year}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingEducation({ ...edu, index })}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEducation(index)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {localProfile.education.length === 0 && (
            <p className="text-gray-500 text-sm">No education added yet</p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="border-t pt-6">
        <button
          onClick={handleSaveChanges}
          disabled={saving}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save All Changes
            </>
          )}
        </button>
      </div>

      {/* Experience Modal */}
      {editingExperience && (
        <ExperienceModal
          experience={editingExperience}
          onSave={handleSaveExperience}
          onClose={() => setEditingExperience(null)}
        />
      )}

      {/* Education Modal */}
      {editingEducation && (
        <EducationModal
          education={editingEducation}
          onSave={handleSaveEducation}
          onClose={() => setEditingEducation(null)}
        />
      )}
    </div>
  );
}

// Experience Modal Component
function ExperienceModal({ experience, onSave, onClose }) {
  const [formData, setFormData] = useState(experience);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, experience.index);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          {experience.index >= 0 ? "Edit" : "Add"} Experience
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Job Title"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Company"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Duration (e.g., 2020-2023)"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg resize-none"
            rows={3}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Education Modal Component
function EducationModal({ education, onSave, onClose }) {
  const [formData, setFormData] = useState(education);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, education.index);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          {education.index >= 0 ? "Edit" : "Add"} Education
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Degree"
            value={formData.degree}
            onChange={(e) =>
              setFormData({ ...formData, degree: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Institution"
            value={formData.institution}
            onChange={(e) =>
              setFormData({ ...formData, institution: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Year (e.g., 2020)"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
