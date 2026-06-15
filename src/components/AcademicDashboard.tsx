import React, { useState } from "react";
import { 
  Building, GraduationCap, Layers, Award, BarChart4, ClipboardCheck, 
  Map, Calendar, Plus, Trash2, Edit3, HelpCircle, Sparkles, BookOpen, 
  ArrowRight, Shield, QrCode, Bookmark, Activity, Users, Settings2, CheckCircle2 
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from "recharts";
import { 
  University, College, School, Department, Faculty, Program, SemesterNode, 
  CurriculumCourseMapping, ProgramLearningOutcome, CourseLearningOutcome 
} from "../types";

export default function AcademicDashboard() {
  // --- STATE SEED DATA ---
  const [activeTab, setActiveTab] = useState<"structure" | "curriculum" | "obe">("structure");

  // SEED DEGREES
  const [degrees] = useState([
    { id: "deg-1", name: "Bachelor of Science (B.Sc.)", durationYears: 4 },
    { id: "deg-2", name: "Master of Science (M.Sc.)", durationYears: 2 },
  ]);

  // SEED UNIVERSITIES
  const [universities, setUniversities] = useState<University[]>([
    {
      id: "univ-1",
      name: "Pacific Rim Technology University",
      code: "PRTU",
      location: "San Francisco Campus, CA",
      colleges: [
        {
          id: "coll-1",
          name: "College of Generative Systems & Computing",
          code: "CGSC",
          schools: [
            {
              id: "sch-1",
              name: "School of Machine intelligence",
              code: "SMI",
              departments: [
                {
                  id: "dept-1",
                  name: "Department of AI Systems Engineering",
                  code: "DAISE",
                  programs: [
                    {
                      id: "prog-1",
                      name: "B.Sc. in Generative AI Systems",
                      code: "BS-GAIS",
                      degreeId: "deg-1",
                      plos: [
                        { id: "plo-1", code: "PLO-1", title: "Mathematical Foundations", description: "Demonstrate solid knowledge of statistics, multi-variable calculus, and mathematical modeling.", accreditationDomain: "Knowledge" },
                        { id: "plo-2", code: "PLO-2", title: "Modern AI Tool Usage", description: "Employ advanced frameworks, cloud-native services, and pre-trained LLM model vectors.", accreditationDomain: "Skills" },
                        { id: "plo-3", code: "PLO-3", title: "Responsible AI & Ethics", description: "Acknowledge bias, align guardrails with global regulations, and implement human-in-the-loop validation.", accreditationDomain: "Ethical" },
                        { id: "plo-4", code: "PLO-4", title: "Systemic Scaling & Ingress", description: "Deploy high-performance inference servers with robust safety buffers and fault mitigation policies.", accreditationDomain: "Knowledge" },
                      ],
                      semesters: [
                        {
                          id: "sem-1",
                          name: "Semester 1",
                          batches: [
                            {
                              id: "bat-1",
                              name: "Batch 2026-Alpha",
                              sections: [
                                {
                                  id: "sec-1",
                                  name: "Section A",
                                  groups: [{ id: "grp-1", name: "Group GenAI-1" }]
                                }
                              ]
                            }
                          ],
                          courses: [
                            {
                              id: "cc-1",
                              courseId: "c-101",
                              courseCode: "GAIS-101",
                              title: "Foundations of Transformers & Weights",
                              creditHours: 3,
                              lectureHours: 3,
                              labHours: 0,
                              preRequisiteIds: [],
                              clos: [
                                { id: "clo-1", code: "CLO-1", description: "Detail attention weight mechanics.", bloomLevel: "C2", weight: 30, mappedPloId: "plo-1" },
                                { id: "clo-2", code: "CLO-2", description: "Deploy localized weight tensors.", bloomLevel: "C3", weight: 70, mappedPloId: "plo-2" }
                              ]
                            },
                            {
                              id: "cc-2",
                              courseId: "c-102",
                              courseCode: "GAIS-102",
                              title: "Responsible AI Design & Guardrails",
                              creditHours: 3,
                              lectureHours: 2,
                              labHours: 2,
                              preRequisiteIds: [],
                              clos: [
                                { id: "clo-3", code: "CLO-1", description: "Verify safety policies on model inference.", bloomLevel: "C4", weight: 50, mappedPloId: "plo-3" },
                                { id: "clo-4", code: "CLO-2", description: "Synthesize localized red-teaming scripts.", bloomLevel: "C6", weight: 50, mappedPloId: "plo-3" }
                              ]
                            }
                          ]
                        },
                        {
                          id: "sem-2",
                          name: "Semester 2",
                          batches: [],
                          courses: [
                            {
                              id: "cc-3",
                              courseId: "c-201",
                              courseCode: "GAIS-201",
                              title: "Scalable Context Windows & Caching",
                              creditHours: 4,
                              lectureHours: 3,
                              labHours: 2,
                              preRequisiteIds: ["cc-1"],
                              clos: [
                                { id: "clo-5", code: "CLO-1", description: "Map computational costs against token overhead.", bloomLevel: "C4", weight: 40, mappedPloId: "plo-4" },
                                { id: "clo-6", code: "CLO-2", description: "Evaluate prompt caching efficiency models.", bloomLevel: "C5", weight: 60, mappedPloId: "plo-4" }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  faculties: [
                    { id: "f-1", name: "Dr. Sarah Jenkins", email: "s.jenkins@prtu.edu", designation: "Dean & Professor", specialization: "Deep Learning" },
                    { id: "f-2", name: "Prof. Arthur Vance", email: "a.vance@prtu.edu", designation: "Associate Professor", specialization: "Ethics in Generative AI" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]);

  // --- INTERACTIVE ACTIVE LEAF MANAGERS ---
  const [selectedUnivId, setSelectedUnivId] = useState<string>("univ-1");
  const [selectedCollId, setSelectedCollId] = useState<string>("coll-1");
  const [selectedSchId, setSelectedSchId] = useState<string>("sch-1");
  const [selectedDeptId, setSelectedDeptId] = useState<string>("dept-1");
  const [selectedProgId, setSelectedProgId] = useState<string>("prog-1");
  const [selectedSemId, setSelectedSemId] = useState<string>("sem-1");

  // MODALS OR ADDERS IN-LINE STATES
  const [newUnivName, setNewUnivName] = useState("");
  const [newUnivCode, setNewUnivCode] = useState("");
  const [newUnivLoc, setNewUnivLoc] = useState("");

  const [newCollName, setNewCollName] = useState("");
  const [newCollCode, setNewCollCode] = useState("");

  const [newSchName, setNewSchName] = useState("");
  const [newSchCode, setNewSchCode] = useState("");

  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");

  const [newProgName, setNewProgName] = useState("");
  const [newProgCode, setNewProgCode] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("deg-1");

  const [newBatchName, setNewBatchName] = useState("");
  const [newSecName, setNewSecName] = useState("");
  const [newGroupName, setNewGroupName] = useState("");

  // CURRICULUM ACTIONS
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseCredits, setNewCourseCredits] = useState<number>(3);
  const [newCourseLects, setNewCourseLects] = useState<number>(3);
  const [newCourseLabs, setNewCourseLabs] = useState<number>(0);
  const [coursePreReqs, setCoursePreReqs] = useState<string[]>([]);

  // OBE CLO ACTIONS
  const [editingCourseMapId, setEditingCourseMapId] = useState<string | null>("cc-1");
  const [newCloDesc, setNewCloDesc] = useState("");
  const [newCloBloom, setNewCloBloom] = useState<"C1" | "C2" | "C3" | "C4" | "C5" | "C6">("C3");
  const [newCloWeight, setNewCloWeight] = useState<number>(50);
  const [newCloPlo, setNewCloPlo] = useState<string>("plo-1");

  // DYNAMIC PLO ADDER
  const [newPloCode, setNewPloCode] = useState("");
  const [newPloTitle, setNewPloTitle] = useState("");
  const [newPloDesc, setNewPloDesc] = useState("");
  const [newPloDomain, setNewPloDomain] = useState<"Knowledge" | "Skills" | "Attitude" | "Ethical">("Knowledge");

  // --- RETRIEVERS ---
  const activeUniv = universities.find(u => u.id === selectedUnivId);
  const activeColl = activeUniv?.colleges.find(c => c.id === selectedCollId);
  const activeSch = activeColl?.schools.find(s => s.id === selectedSchId);
  const activeDept = activeSch?.departments.find(d => d.id === selectedDeptId);
  const activeProg = activeDept?.programs.find(p => p.id === selectedProgId);
  const activeSem = activeProg?.semesters.find(s => s.id === selectedSemId);

  // --- CORE SYSTEM MODIFIERS ---
  const handleAddUniversity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnivName || !newUnivCode) return;
    const item: University = {
      id: `univ-${Date.now()}`,
      name: newUnivName,
      code: newUnivCode.toUpperCase(),
      location: newUnivLoc || "Main Campus",
      colleges: []
    };
    setUniversities([...universities, item]);
    setSelectedUnivId(item.id);
    setNewUnivName("");
    setNewUnivCode("");
    setNewUnivLoc("");
  };

  const handleAddCollege = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollName || !newCollCode || !selectedUnivId) return;
    const item: College = {
      id: `coll-${Date.now()}`,
      name: newCollName,
      code: newCollCode.toUpperCase(),
      schools: []
    };
    setUniversities(prev => prev.map(u => {
      if (u.id === selectedUnivId) {
        return { ...u, colleges: [...u.colleges, item] };
      }
      return u;
    }));
    setSelectedCollId(item.id);
    setNewCollName("");
    setNewCollCode("");
  };

  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchName || !newSchCode || !selectedUnivId || !selectedCollId) return;
    const item: School = {
      id: `sch-${Date.now()}`,
      name: newSchName,
      code: newSchCode.toUpperCase(),
      departments: []
    };
    setUniversities(prev => prev.map(u => {
      if (u.id === selectedUnivId) {
        return {
          ...u,
          colleges: u.colleges.map(c => {
            if (c.id === selectedCollId) {
              return { ...c, schools: [...c.schools, item] };
            }
            return c;
          })
        };
      }
      return u;
    }));
    setSelectedSchId(item.id);
    setNewSchName("");
    setNewSchCode("");
  };

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newDeptCode || !selectedUnivId || !selectedCollId || !selectedSchId) return;
    const item: Department = {
      id: `dept-${Date.now()}`,
      name: newDeptName,
      code: newDeptCode.toUpperCase(),
      faculties: [],
      programs: []
    };
    setUniversities(prev => prev.map(u => {
      if (u.id === selectedUnivId) {
        return {
          ...u,
          colleges: u.colleges.map(c => {
            if (c.id === selectedCollId) {
              return {
                ...c,
                schools: c.schools.map(s => {
                  if (s.id === selectedSchId) {
                    return { ...s, departments: [...s.departments, item] };
                  }
                  return s;
                })
              };
            }
            return c;
          })
        };
      }
      return u;
    }));
    setSelectedDeptId(item.id);
    setNewDeptName("");
    setNewDeptCode("");
  };

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgName || !newProgCode || !selectedUnivId || !selectedCollId || !selectedSchId || !selectedDeptId) return;
    const item: Program = {
      id: `prog-${Date.now()}`,
      name: newProgName,
      code: newProgCode.toUpperCase(),
      degreeId: selectedDegree,
      plos: [
        { id: `plo-${Date.now()}-1`, code: "PLO-1", title: "Core Competency", description: "Demonstrate professional knowledge in theoretical and applied models.", accreditationDomain: "Knowledge" },
        { id: `plo-${Date.now()}-2`, code: "PLO-2", title: "modern Engineering Practice", description: "Implement, scale, and evaluate software tools.", accreditationDomain: "Skills" }
      ],
      semesters: [
        { id: "sem-new-1", name: "Semester 1", batches: [], courses: [] },
        { id: "sem-new-2", name: "Semester 2", batches: [], courses: [] }
      ]
    };
    setUniversities(prev => prev.map(u => {
      if (u.id === selectedUnivId) {
        return {
          ...u,
          colleges: u.colleges.map(c => {
            if (c.id === selectedCollId) {
              return {
                ...c,
                schools: c.schools.map(s => {
                  if (s.id === selectedSchId) {
                    return {
                      ...s,
                      departments: s.departments.map(d => {
                        if (d.id === selectedDeptId) {
                          return { ...d, programs: [...d.programs, item] };
                        }
                        return d;
                      })
                    };
                  }
                  return s;
                })
              };
            }
            return c;
          })
        };
      }
      return u;
    }));
    setSelectedProgId(item.id);
    setNewProgName("");
    setNewProgCode("");
  };

  // --- PLO MANAGERS ---
  const handleAddPlo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPloCode || !newPloTitle || !selectedUnivId || !selectedCollId || !selectedSchId || !selectedDeptId || !selectedProgId) return;
    const newPlo: ProgramLearningOutcome = {
      id: `plo-${Date.now()}`,
      code: newPloCode.toUpperCase(),
      title: newPloTitle,
      description: newPloDesc || "General Program competence validation criterion.",
      accreditationDomain: newPloDomain
    };

    setUniversities(prev => prev.map(u => {
      if (u.id === selectedUnivId) {
        return {
          ...u,
          colleges: u.colleges.map(c => {
            if (c.id === selectedCollId) {
              return {
                ...c,
                schools: c.schools.map(s => {
                  if (s.id === selectedSchId) {
                    return {
                      ...s,
                      departments: s.departments.map(d => {
                        if (d.id === selectedDeptId) {
                          return {
                            ...d,
                            programs: d.programs.map(p => {
                              if (p.id === selectedProgId) {
                                return { ...p, plos: [...p.plos, newPlo] };
                              }
                              return p;
                            })
                          };
                        }
                        return d;
                      })
                    };
                  }
                  return s;
                })
              };
            }
            return c;
          })
        };
      }
      return u;
    }));

    setNewPloCode("");
    setNewPloTitle("");
    setNewPloDesc("");
  };

  // --- BATCH, SECTION & GROUP BUILDER ---
  const handleAddBatchNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName || !selectedUnivId || !selectedCollId || !selectedSchId || !selectedDeptId || !selectedProgId || !selectedSemId) return;
    
    setUniversities(prev => prev.map(u => {
      if (u.id === selectedUnivId) {
        return {
          ...u,
          colleges: u.colleges.map(c => {
            if (c.id === selectedCollId) {
              return {
                ...c,
                schools: c.schools.map(s => {
                  if (s.id === selectedSchId) {
                    return {
                      ...s,
                      departments: s.departments.map(d => {
                        if (d.id === selectedDeptId) {
                          return {
                            ...d,
                            programs: d.programs.map(p => {
                              if (p.id === selectedProgId) {
                                return {
                                  ...p,
                                  semesters: p.semesters.map(sem => {
                                    if (sem.id === selectedSemId) {
                                      const newBatch = {
                                        id: `bat-${Date.now()}`,
                                        name: newBatchName,
                                        sections: []
                                      };
                                      return { ...sem, batches: [...sem.batches, newBatch] };
                                    }
                                    return sem;
                                  })
                                };
                              }
                              return p;
                            })
                          };
                        }
                        return d;
                      })
                    };
                  }
                  return s;
                })
              };
            }
            return c;
          })
        };
      }
      return u;
    }));

    setNewBatchName("");
  };

  const handleAddSectionNode = (batchId: string) => {
    if (!newSecName || !selectedUnivId || !selectedCollId || !selectedSchId || !selectedDeptId || !selectedProgId || !selectedSemId) return;
    
    setUniversities(prev => prev.map(u => {
      if (u.id === selectedUnivId) {
        return {
          ...u,
          colleges: u.colleges.map(c => {
            if (c.id === selectedCollId) {
              return {
                ...c,
                schools: c.schools.map(s => {
                  if (s.id === selectedSchId) {
                    return {
                      ...s,
                      departments: s.departments.map(d => {
                        if (d.id === selectedDeptId) {
                          return {
                            ...d,
                            programs: d.programs.map(p => {
                              if (p.id === selectedProgId) {
                                return {
                                  ...p,
                                  semesters: p.semesters.map(sem => {
                                    if (sem.id === selectedSemId) {
                                      return {
                                        ...sem,
                                        batches: sem.batches.map(b => {
                                          if (b.id === batchId) {
                                            const newSection = {
                                              id: `sec-${Date.now()}`,
                                              name: newSecName,
                                              groups: []
                                            };
                                            return { ...b, sections: [...b.sections, newSection] };
                                          }
                                          return b;
                                        })
                                      };
                                    }
                                    return sem;
                                  })
                                };
                              }
                              return p;
                            })
                          };
                        }
                        return d;
                      })
                    };
                  }
                  return s;
                })
              };
            }
            return c;
          })
        };
      }
      return u;
    }));

    setNewSecName("");
  };

  const handleAddGroupNode = (batchId: string, sectionId: string) => {
    if (!newGroupName || !selectedUnivId || !selectedCollId || !selectedSchId || !selectedDeptId || !selectedProgId || !selectedSemId) return;
    
    setUniversities(prev => prev.map(u => {
      if (u.id === selectedUnivId) {
        return {
          ...u,
          colleges: u.colleges.map(c => {
            if (c.id === selectedCollId) {
              return {
                ...c,
                schools: c.schools.map(s => {
                  if (s.id === selectedSchId) {
                    return {
                      ...s,
                      departments: s.departments.map(d => {
                        if (d.id === selectedDeptId) {
                          return {
                            ...d,
                            programs: d.programs.map(p => {
                              if (p.id === selectedProgId) {
                                return {
                                  ...p,
                                  semesters: p.semesters.map(sem => {
                                    if (sem.id === selectedSemId) {
                                      return {
                                        ...sem,
                                        batches: sem.batches.map(b => {
                                          if (b.id === batchId) {
                                            return {
                                              ...b,
                                              sections: b.sections.map(sec => {
                                                if (sec.id === sectionId) {
                                                  const newGroup = {
                                                    id: `grp-${Date.now()}`,
                                                    name: newGroupName
                                                  };
                                                  return { ...sec, groups: [...sec.groups, newGroup] };
                                                }
                                                return sec;
                                              })
                                            };
                                          }
                                          return b;
                                        })
                                      };
                                    }
                                    return sem;
                                  })
                                };
                              }
                              return p;
                            })
                          };
                        }
                        return d;
                      })
                    };
                  }
                  return s;
                })
              };
            }
            return c;
          })
        };
      }
      return u;
    }));

    setNewGroupName("");
  };

  // --- CURRICULUM COURSE MAPPING ---
  const handleAddCourseMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseCode || !selectedUnivId || !selectedCollId || !selectedSchId || !selectedDeptId || !selectedProgId || !selectedSemId) return;

    const newMap: CurriculumCourseMapping = {
      id: `cc-${Date.now()}`,
      courseId: `c-${Date.now()}`,
      courseCode: newCourseCode.toUpperCase(),
      title: newCourseTitle,
      creditHours: Number(newCourseCredits),
      lectureHours: Number(newCourseLects),
      labHours: Number(newCourseLabs),
      preRequisiteIds: coursePreReqs,
      clos: []
    };

    setUniversities(prev => prev.map(u => {
      if (u.id === selectedUnivId) {
        return {
          ...u,
          colleges: u.colleges.map(c => {
            if (c.id === selectedCollId) {
              return {
                ...c,
                schools: c.schools.map(s => {
                  if (s.id === selectedSchId) {
                    return {
                      ...s,
                      departments: s.departments.map(d => {
                        if (d.id === selectedDeptId) {
                          return {
                            ...d,
                            programs: d.programs.map(p => {
                              if (p.id === selectedProgId) {
                                return {
                                  ...p,
                                  semesters: p.semesters.map(sem => {
                                    if (sem.id === selectedSemId) {
                                      return { ...sem, courses: [...sem.courses, newMap] };
                                    }
                                    return sem;
                                  })
                                };
                              }
                              return p;
                            })
                          };
                        }
                        return d;
                      })
                    };
                  }
                  return s;
                })
              };
            }
            return c;
          })
        };
      }
      return u;
    }));

    setNewCourseTitle("");
    setNewCourseCode("");
    setNewCourseCredits(3);
    setNewCourseLects(3);
    setNewCourseLabs(0);
    setCoursePreReqs([]);
  };

  const handleDeleteCourseMapping = (ccId: string) => {
    setUniversities(prev => prev.map(u => {
      if (u.id === selectedUnivId) {
        return {
          ...u,
          colleges: u.colleges.map(c => {
            if (c.id === selectedCollId) {
              return {
                ...c,
                schools: c.schools.map(s => {
                  if (s.id === selectedSchId) {
                    return {
                      ...s,
                      departments: s.departments.map(d => {
                        if (d.id === selectedDeptId) {
                          return {
                            ...d,
                            programs: d.programs.map(p => {
                              if (p.id === selectedProgId) {
                                return {
                                  ...p,
                                  semesters: p.semesters.map(sem => {
                                    if (sem.id === selectedSemId) {
                                      return { ...sem, courses: sem.courses.filter(item => item.id !== ccId) };
                                    }
                                    return sem;
                                  })
                                };
                              }
                              return p;
                            })
                          };
                        }
                        return d;
                      })
                    };
                  }
                  return s;
                })
              };
            }
            return c;
          })
        };
      }
      return u;
    }));
  };

  // --- COURSE LEARNING OUTCOME (CLO) ADDER & MATRICES ---
  const handleAddCloNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCloDesc || !editingCourseMapId || !selectedUnivId || !selectedCollId || !selectedSchId || !selectedDeptId || !selectedProgId || !selectedSemId) return;

    setUniversities(prev => prev.map(u => {
      if (u.id === selectedUnivId) {
        return {
          ...u,
          colleges: u.colleges.map(c => {
            if (c.id === selectedCollId) {
              return {
                ...c,
                schools: c.schools.map(s => {
                  if (s.id === selectedSchId) {
                    return {
                      ...s,
                      departments: s.departments.map(d => {
                        if (d.id === selectedDeptId) {
                          return {
                            ...d,
                            programs: d.programs.map(p => {
                              if (p.id === selectedProgId) {
                                return {
                                  ...p,
                                  semesters: p.semesters.map(sem => {
                                    if (sem.id === selectedSemId) {
                                      return {
                                        ...sem,
                                        courses: sem.courses.map(course => {
                                          if (course.id === editingCourseMapId) {
                                            const newClo: CourseLearningOutcome = {
                                              id: `clo-${Date.now()}`,
                                              code: `CLO-${course.clos.length + 1}`,
                                              description: newCloDesc,
                                              bloomLevel: newCloBloom,
                                              weight: Number(newCloWeight),
                                              mappedPloId: newCloPlo
                                            };
                                            return { ...course, clos: [...course.clos, newClo] };
                                          }
                                          return course;
                                        })
                                      };
                                    }
                                    return sem;
                                  })
                                };
                              }
                              return p;
                            })
                          };
                        }
                        return d;
                      })
                    };
                  }
                  return s;
                })
              };
            }
            return c;
          })
        };
      }
      return u;
    }));

    setNewCloDesc("");
    setNewCloWeight(50);
  };

  const handleDeleteCloNode = (courseMapId: string, cloId: string) => {
    setUniversities(prev => prev.map(u => {
      if (u.id === selectedUnivId) {
        return {
          ...u,
          colleges: u.colleges.map(c => {
            if (c.id === selectedCollId) {
              return {
                ...c,
                schools: c.schools.map(s => {
                  if (s.id === selectedSchId) {
                    return {
                      ...s,
                      departments: s.departments.map(d => {
                        if (d.id === selectedDeptId) {
                          return {
                            ...d,
                            programs: d.programs.map(p => {
                              if (p.id === selectedProgId) {
                                return {
                                  ...p,
                                  semesters: p.semesters.map(sem => {
                                    if (sem.id === selectedSemId) {
                                      return {
                                        ...sem,
                                        courses: sem.courses.map(course => {
                                          if (course.id === courseMapId) {
                                            return { ...course, clos: course.clos.filter(cl => cl.id !== cloId) };
                                          }
                                          return course;
                                        })
                                      };
                                    }
                                    return sem;
                                  })
                                };
                              }
                              return p;
                            })
                          };
                        }
                        return d;
                      })
                    };
                  }
                  return s;
                })
              };
            }
            return c;
          })
        };
      }
      return u;
    }));
  };

  // --- ANALYTICS AND VALUE PREP FOR RECHARTS ---
  // Bloom's taxonomy aggregates
  const rawBloomCount = { C1: 0, C2: 0, C3: 0, C4: 0, C5: 0, C6: 0 };
  const rawPloWeight: Record<string, number> = {};

  if (activeProg) {
    activeProg.semesters.forEach(sem => {
      sem.courses.forEach(c => {
        c.clos.forEach(cl => {
          rawBloomCount[cl.bloomLevel] += 1;
          rawPloWeight[cl.mappedPloId] = (rawPloWeight[cl.mappedPloId] || 0) + cl.weight;
        });
      });
    });
  }

  const bloomTaxonomyLabels: Record<string, string> = {
    C1: "Remember (Retrieve Knowledge)",
    C2: "Understand (Interpret & Clarify)",
    C3: "Apply (Execute & Implement)",
    C4: "Analyze (Outline & Integrate)",
    C5: "Evaluate (Critique & Judge)",
    C6: "Create (Design & Devise)"
  };

  const bloomChartData = Object.keys(rawBloomCount).map(key => ({
    level: key,
    label: bloomTaxonomyLabels[key],
    count: rawBloomCount[key as keyof typeof rawBloomCount],
    fullMark: 5
  }));

  const ploChartData = (activeProg?.plos || []).map(plo => ({
    name: plo.code,
    fullName: plo.title,
    alignmentScore: rawPloWeight[plo.id] || 0,
    accreditationLimit: 120
  }));

  // Calculate Semester Credit Validation warnings
  const currentSemCredits = activeSem?.courses.reduce((acc, current) => acc + current.creditHours, 0) || 0;
  const isSyllabusOversized = currentSemCredits > 18;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden animate-fade-in" id="academic-ms-root">
      {/* Upper Navigation Rail & Title */}
      <div className="bg-slate-900 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-650 rounded-xl flex items-center justify-center font-bold text-white shadow-md">
            🏗️
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-tight text-white uppercase font-mono">Academic Management workspace</h2>
            <p className="text-xs text-slate-400">Manage Universities, Colleges, Curriculum Building & Outcome-Based Education (OBE) compliance</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-850 p-1 rounded-xl w-fit border border-slate-800">
          <button
            onClick={() => setActiveTab("structure")}
            aria-label="Toggle Academic Structure Tree View"
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "structure" ? "bg-blue-600 text-white shadow-md font-extrabold" : "text-slate-400 hover:text-white"}`}
          >
            <Building className="w-3.5 h-3.5" /> Academic Structure
          </button>
          <button
            onClick={() => setActiveTab("curriculum")}
            aria-label="Toggle Curriculum Builder and Course Mappings"
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "curriculum" ? "bg-blue-600 text-white shadow-md font-extrabold" : "text-slate-400 hover:text-white"}`}
          >
            <Layers className="w-3.5 h-3.5" /> Curriculum Builder
          </button>
          <button
            onClick={() => setActiveTab("obe")}
            aria-label="Toggle Outcome-Based Education and Bloom Taxonomy"
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "obe" ? "bg-blue-600 text-white shadow-md font-extrabold" : "text-slate-400 hover:text-white"}`}
          >
            <Award className="w-3.5 h-3.5" /> OBE & Bloom matrix
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* HIERARCHICAL LEVEL SELECTORS */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 bg-slate-50 p-4 rounded-xl border border-gray-150">
          <div>
            <label className="text-[10px] uppercase text-gray-400 font-extrabold tracking-wider block mb-1">University</label>
            <select
              value={selectedUnivId}
              onChange={(e) => {
                setSelectedUnivId(e.target.value);
                const firstColl = universities.find(u => u.id === e.target.value)?.colleges[0];
                setSelectedCollId(firstColl?.id || "");
                const firstSch = firstColl?.schools[0];
                setSelectedSchId(firstSch?.id || "");
                const firstDept = firstSch?.departments[0];
                setSelectedDeptId(firstDept?.id || "");
                const firstProg = firstDept?.programs[0];
                setSelectedProgId(firstProg?.id || "");
              }}
              aria-label="Select Academic University"
              className="bg-white border border-gray-200 text-xs px-2 py-1.5 rounded-lg font-semibold text-gray-800 outline-hidden w-full cursor-pointer"
            >
              {universities.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase text-gray-400 font-extrabold tracking-wider block mb-1">College</label>
            <select
              value={selectedCollId}
              onChange={(e) => {
                setSelectedCollId(e.target.value);
                const firstSch = activeUniv?.colleges.find(c => c.id === e.target.value)?.schools[0];
                setSelectedSchId(firstSch?.id || "");
                const firstDept = firstSch?.departments[0];
                setSelectedDeptId(firstDept?.id || "");
                const firstProg = firstDept?.programs[0];
                setSelectedProgId(firstProg?.id || "");
              }}
              aria-label="Select College"
              className="bg-white border border-gray-200 text-xs px-2 py-1.5 rounded-lg font-semibold text-gray-800 outline-hidden w-full cursor-pointer"
            >
              <option value="">-- No College --</option>
              {activeUniv?.colleges.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase text-gray-400 font-extrabold tracking-wider block mb-1">School</label>
            <select
              value={selectedSchId}
              onChange={(e) => {
                setSelectedSchId(e.target.value);
                const firstDept = activeColl?.schools.find(s => s.id === e.target.value)?.departments[0];
                setSelectedDeptId(firstDept?.id || "");
                const firstProg = firstDept?.programs[0];
                setSelectedProgId(firstProg?.id || "");
              }}
              aria-label="Select School"
              className="bg-white border border-gray-200 text-xs px-2 py-1.5 rounded-lg font-semibold text-gray-800 outline-hidden w-full cursor-pointer"
            >
              <option value="">-- No School --</option>
              {activeColl?.schools.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase text-gray-400 font-extrabold tracking-wider block mb-1">Department</label>
            <select
              value={selectedDeptId}
              onChange={(e) => {
                setSelectedDeptId(e.target.value);
                const firstProg = activeSch?.departments.find(d => d.id === e.target.value)?.programs[0];
                setSelectedProgId(firstProg?.id || "");
              }}
              aria-label="Select Department"
              className="bg-white border border-gray-200 text-xs px-2 py-1.5 rounded-lg font-semibold text-gray-800 outline-hidden w-full cursor-pointer"
            >
              <option value="">-- No Dept --</option>
              {activeSch?.departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase text-gray-400 font-extrabold tracking-wider block mb-1">Academic Program</label>
            <select
              value={selectedProgId}
              onChange={(e) => setSelectedProgId(e.target.value)}
              aria-label="Select Program"
              className="bg-indigo-50 border border-indigo-200 text-xs px-2 py-1.5 rounded-lg font-bold text-indigo-900 outline-hidden w-full cursor-pointer"
            >
              <option value="">-- No Program --</option>
              {activeDept?.programs.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase text-gray-400 font-extrabold tracking-wider block mb-1">Semester / Term</label>
            <select
              value={selectedSemId}
              onChange={(e) => setSelectedSemId(e.target.value)}
              aria-label="Select Semester Term"
              className="bg-white border border-gray-200 text-xs px-2 py-1.5 rounded-lg font-semibold text-gray-800 outline-hidden w-full cursor-pointer"
            >
              {activeProg?.semesters.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ==================== TAB 1: ACADEMIC STRUCTURE ==================== */}
        {activeTab === "structure" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT COLUMN: ACTIVE HIERARCHAL DETAIL TRACE */}
              <div className="lg:col-span-2 space-y-4">
                <div className="border border-gray-150 rounded-xl p-5 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 mb-1">
                    <span className="text-xs font-bold text-slate-800 uppercase font-mono flex items-center gap-1.5">
                      🏛️ Comprehensive Academic Tree Nodes
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold py-1 px-2.5 rounded-full uppercase">
                      Node Validated
                    </span>
                  </div>

                  <div className="space-y-3 font-medium text-xs text-gray-650">
                    <div className="flex items-center gap-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="w-24 text-[10px] uppercase text-gray-400 tracking-wider font-extrabold shrink-0">University:</span>
                      <span className="text-gray-900 font-bold">{activeUniv?.name || "None Selected"} ({activeUniv?.code || "N/A"})</span>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="w-24 text-[10px] uppercase text-gray-400 tracking-wider font-extrabold shrink-0">College:</span>
                      <span className="text-gray-900 font-bold">{activeColl?.name || "None Selected"}</span>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="w-24 text-[10px] uppercase text-gray-400 tracking-wider font-extrabold shrink-0">School:</span>
                      <span className="text-gray-900 font-bold">{activeSch?.name || "None Selected"}</span>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="w-24 text-[10px] uppercase text-gray-400 tracking-wider font-extrabold shrink-0">Department:</span>
                      <span className="text-gray-900 font-bold">{activeDept?.name || "None Selected"}</span>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-100 p-2.5 rounded-lg border border-gray-150">
                      <span className="w-24 text-[10px] uppercase text-indigo-500 tracking-wider font-extrabold shrink-0">MAPPED DEGREE:</span>
                      <span className="text-indigo-900 font-extrabold">
                        {degrees.find(d => d.id === activeProg?.degreeId)?.name || "Bachelor of Science (B.Sc.)"}
                      </span>
                    </div>
                  </div>

                  {/* BATCh, SECTIONS & GROUPS DYNAMIC MANAGER UNDER SELECTED SEMESTER */}
                  <div className="mt-6 pt-5 border-t border-gray-150 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 font-mono">
                      📅 Batches, Sections & Student Groups under {activeSem?.name || "this term"}
                    </h3>

                    <form onSubmit={handleAddBatchNode} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add Batch (e.g. Batch 2026-B)"
                        value={newBatchName}
                        onChange={(e) => setNewBatchName(e.target.value)}
                        className="text-xs border border-gray-200 hover:border-gray-400 rounded-lg py-1 px-3 outline-hidden flex-1 font-medium text-gray-850"
                      />
                      <button
                        type="submit"
                        aria-label="Add new batch element"
                        className="bg-blue-600 hover:bg-blue-750 text-white font-bold text-xs py-1.5 px-3 rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Batch
                      </button>
                    </form>

                    {/* RENDER BATCH NODES */}
                    <div className="space-y-4 mt-3">
                      {activeSem?.batches.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No batches configured for {activeSem?.name}.</p>
                      ) : (
                        activeSem?.batches.map(batch => (
                          <div key={batch.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3">
                            <div className="flex justify-between items-center border-b pb-2">
                              <span className="text-xs font-extrabold text-blue-900">{batch.name}</span>
                              
                              {/* Quick Section Add */}
                              <div className="flex gap-2 text-xs">
                                <input
                                  type="text"
                                  placeholder="New Section"
                                  value={newSecName}
                                  onChange={(e) => setNewSecName(e.target.value)}
                                  className="bg-white border text-xs py-0.5 px-2 rounded-md outline-hidden font-medium w-28 border-gray-200"
                                />
                                <button
                                  onClick={() => handleAddSectionNode(batch.id)}
                                  aria-label={`Add section to ${batch.name}`}
                                  className="bg-slate-800 hover:bg-black text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md"
                                >
                                  + Section
                                </button>
                              </div>
                            </div>

                            {/* SECTIONS LIST */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {batch.sections.map(section => (
                                <div key={section.id} className="bg-white border border-gray-250 p-3 rounded-lg space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-800">{section.name}</span>
                                    
                                    {/* Add student group inside this section */}
                                    <div className="flex gap-1">
                                      <input
                                        type="text"
                                        placeholder="Group"
                                        value={newGroupName}
                                        onChange={(e) => setNewGroupName(e.target.value)}
                                        className="text-[10px] border px-1.5 py-0.5 rounded-md outline-hidden w-20 border-gray-200"
                                      />
                                      <button
                                        onClick={() => handleAddGroupNode(batch.id, section.id)}
                                        aria-label={`Add student group to ${section.name}`}
                                        className="bg-indigo-650 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md"
                                      >
                                        + Group
                                      </button>
                                    </div>
                                  </div>

                                  {/* GROUPS LIST */}
                                  <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-gray-100">
                                    {section.groups.length === 0 ? (
                                      <span className="text-[10px] text-gray-400 italic">No Groups</span>
                                    ) : (
                                      section.groups.map(g => (
                                        <span key={g.id} className="bg-indigo-50 border border-indigo-150 text-indigo-700 text-[10.5px] px-2 py-0.5 rounded-md font-bold">
                                          {g.name}
                                        </span>
                                      ))
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: DIRECT CREATORS OF HIGHER NODES */}
              <div className="space-y-4">
                <div className="bg-[#f8fafc] p-5 rounded-2xl border border-gray-150 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 font-mono">
                    <Plus className="w-4 h-4 text-blue-650" /> Add Structure Nodes
                  </h3>

                  {/* ADD UNIVERSITY */}
                  <form onSubmit={handleAddUniversity} className="bg-white p-3.5 rounded-xl border border-gray-100 space-y-2.5">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">1. Provision New University</span>
                    <input
                      type="text"
                      placeholder="University Name"
                      value={newUnivName}
                      onChange={(e) => setNewUnivName(e.target.value)}
                      className="text-xs border border-gray-200 hover:border-gray-450 px-2 py-1.5 rounded-lg w-full font-semibold"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Code (e.g. MIT)"
                        value={newUnivCode}
                        onChange={(e) => setNewUnivCode(e.target.value)}
                        className="text-xs border border-gray-200 hover:border-gray-450 px-2 py-1.5 rounded-lg font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={newUnivLoc}
                        onChange={(e) => setNewUnivLoc(e.target.value)}
                        className="text-xs border border-gray-200 hover:border-gray-450 px-2 py-1.5 rounded-lg font-semibold"
                      />
                    </div>
                    <button
                      type="submit"
                      aria-label="Submit university config"
                      className="w-full bg-slate-905 bg-slate-900 text-white font-bold text-xs py-1.5 rounded-lg cursor-pointer hover:bg-black transition-colors"
                    >
                      Provision University
                    </button>
                  </form>

                  {/* ADD COLLEGE */}
                  <form onSubmit={handleAddCollege} className="bg-white p-3.5 rounded-xl border border-gray-100 space-y-2.5">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">2. Add College under Active Univ</span>
                    <input
                      type="text"
                      placeholder="College Name"
                      value={newCollName}
                      onChange={(e) => setNewCollName(e.target.value)}
                      className="text-xs border border-gray-200 hover:border-gray-450 px-2 py-1.5 rounded-lg w-full font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="College Code (e.g. COCE)"
                      value={newCollCode}
                      onChange={(e) => setNewCollCode(e.target.value)}
                      className="text-xs border border-gray-200 hover:border-gray-450 px-2 py-1.5 rounded-lg w-full font-semibold"
                    />
                    <button
                      type="submit"
                      aria-label="Submit college config"
                      className="w-full bg-blue-600 text-white font-bold text-xs py-1.5 rounded-lg cursor-pointer hover:bg-blue-750 transition-colors"
                    >
                      Add College
                    </button>
                  </form>

                  {/* ADD SCHOOL */}
                  <form onSubmit={handleAddSchool} className="bg-white p-3.5 rounded-xl border border-gray-100 space-y-2.5">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">3. Add School under Active College</span>
                    <input
                      type="text"
                      placeholder="School Name (e.g. School of Physics)"
                      value={newSchName}
                      onChange={(e) => setNewSchName(e.target.value)}
                      className="text-xs border border-gray-200 hover:border-gray-450 px-2 py-1.5 rounded-lg w-full font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="School Code"
                      value={newSchCode}
                      onChange={(e) => setNewSchCode(e.target.value)}
                      className="text-xs border border-gray-200 hover:border-gray-450 px-2 py-1.5 rounded-lg w-full font-semibold"
                    />
                    <button
                      type="submit"
                      aria-label="Submit school config"
                      className="w-full bg-indigo-650 text-white font-bold text-xs py-1.5 rounded-lg cursor-pointer hover:bg-slate-900 transition-colors"
                    >
                      Add School Node
                    </button>
                  </form>

                  {/* ADD DEPARTMENT */}
                  <form onSubmit={handleAddDepartment} className="bg-white p-3.5 rounded-xl border border-gray-100 space-y-2.5">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">4. Add Department under Active School</span>
                    <input
                      type="text"
                      placeholder="Department Name"
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      className="text-xs border border-gray-200 hover:border-gray-450 px-2 py-1.5 rounded-lg w-full font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Department Code"
                      value={newDeptCode}
                      onChange={(e) => setNewDeptCode(e.target.value)}
                      className="text-xs border border-gray-200 hover:border-gray-450 px-2 py-1.5 rounded-lg w-full font-semibold"
                    />
                    <button
                      type="submit"
                      aria-label="Submit department config"
                      className="w-full bg-emerald-600 text-white font-bold text-xs py-1.5 rounded-lg cursor-pointer hover:bg-emerald-705 transition-colors"
                    >
                      Add Department Node
                    </button>
                  </form>

                  {/* ADD PROGRAM */}
                  <form onSubmit={handleAddProgram} className="bg-white p-3.5 rounded-xl border border-gray-100 space-y-2.5">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">5. Add Program under Dept</span>
                    <input
                      type="text"
                      placeholder="Program Name (e.g. B.Sc. in Physics)"
                      value={newProgName}
                      onChange={(e) => setNewProgName(e.target.value)}
                      className="text-xs border border-gray-200 hover:border-gray-450 px-2 py-1.5 rounded-lg w-full font-semibold"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Code"
                        value={newProgCode}
                        onChange={(e) => setNewProgCode(e.target.value)}
                        className="text-xs border border-gray-200 hover:border-gray-450 px-2 py-1.5 rounded-lg w-full font-semibold animate-none"
                      />
                      <select
                        value={selectedDegree}
                        onChange={(e) => setSelectedDegree(e.target.value)}
                        aria-label="Select Degree Program"
                        className="bg-white border text-xs px-2 py-1.5 rounded-lg outline-hidden font-semibold cursor-pointer text-gray-800"
                      >
                        {degrees.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      aria-label="Submit program configuration"
                      className="w-full bg-purple-700 hover:bg-black text-white font-bold text-xs py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      Add Academic Program
                    </button>
                  </form>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== TAB 2: CURRICULUM BUILDER ==================== */}
        {activeTab === "curriculum" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* SYLLABUS LIST OF ACTIVE SEMESTER */}
              <div className="lg:col-span-2 space-y-4">
                <div className="border border-gray-150 rounded-xl p-5 bg-white space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b pb-3 mb-1">
                    <div>
                      <span className="text-xs font-bold text-slate-800 uppercase font-mono block">
                        📚 {activeSem?.name || "Semester 1"} Active Syllabus Builder
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Map core courses, assign credit structures, and configure lecture/lab intervals.
                      </span>
                    </div>

                    {/* Dynamic Credit Validation badge */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-400">Total Credits:</span>
                      <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md ${isSyllabusOversized ? "bg-red-50 text-red-700 animate-pulse border border-red-200" : "bg-blue-50 text-blue-700"}`}>
                        {currentSemCredits} / 18 Max
                      </span>
                    </div>
                  </div>

                  {isSyllabusOversized && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3.5 rounded-xl flex items-center gap-2">
                      <span className="text-base">⚠️</span>
                      <p className="font-medium">
                        <strong>Curriculum Advisory Limit Exceeded!</strong> This semester possesses {currentSemCredits} credit hours. The academic accreditation cap demands ≤ 18 hours to assure Outcome-Based Education (OBE) compliance.
                      </p>
                    </div>
                  )}

                  {/* COURSE MAPPINGS TABLE */}
                  <div className="overflow-x-auto space-y-2">
                    {activeSem?.courses.length === 0 ? (
                      <div className="p-8 text-center italic text-gray-400 text-xs">
                        No course mappings constructed for this semester yet. Use the Creator Panel on the right.
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {activeSem?.courses.map((course) => (
                          <div 
                            key={course.id} 
                            className={`p-4 rounded-xl border transition-all ${editingCourseMapId === course.id ? "border-blue-500 bg-blue-50/20 shadow-xs" : "border-gray-250 bg-white"}`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase tracking-wider bg-slate-100 hover:bg-slate-200/50 text-slate-700 px-2 py-0.5 rounded-md font-bold font-mono">
                                  {course.courseCode}
                                </span>
                                <h4 className="text-xs font-extrabold text-gray-950">{course.title}</h4>
                                <div className="flex gap-4 text-[11px] text-gray-500">
                                  <span>Credit Hours: <strong className="text-slate-900">{course.creditHours}</strong></span>
                                  <span>Lecture: <strong className="text-slate-900">{course.lectureHours} hr</strong></span>
                                  <span>Lab: <strong className="text-slate-900">{course.labHours} hr</strong></span>
                                  {course.preRequisiteIds.length > 0 && (
                                    <span className="text-amber-750 font-semibold bg-amber-50 px-1.5 rounded">
                                      Prereq: {course.preRequisiteIds.join(", ")}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setEditingCourseMapId(course.id)}
                                  className={`text-xs px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-colors ${editingCourseMapId === course.id ? "bg-blue-600 text-white border-blue-650" : "bg-slate-50 text-gray-650 border-gray-200 hover:bg-gray-150"}`}
                                >
                                  {editingCourseMapId === course.id ? "Selected for OBE" : "Select for OBE Map"}
                                </button>
                                <button
                                  onClick={() => handleDeleteCourseMapping(course.id)}
                                  aria-label={`Delete ${course.title} alignment`}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-200/50 text-red-650 hover:text-red-800 rounded-lg cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* RENDER CLOs INSIDE THE INSTANCE */}
                            {course.clos.length > 0 && (
                              <div className="mt-3.5 pt-3.5 border-t border-dashed border-gray-200 space-y-2">
                                <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block tracking-wider">
                                  Mapped CLOs & Cognitive Taxonomies
                                </span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                  {course.clos.map(clo => {
                                    const linkedPlo = activeProg?.plos.find(p => p.id === clo.mappedPloId);
                                    return (
                                      <div key={clo.id} className="bg-white border border-gray-150 p-2.5 rounded-lg text-[11.5px] flex items-start justify-between gap-2.5">
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-2.5">
                                            <span className="font-extrabold text-blue-700 uppercase font-mono text-[10.5px]">
                                              {clo.code}
                                            </span>
                                            <span className="bg-blue-50 text-blue-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                                              Bloom Level {clo.bloomLevel}
                                            </span>
                                          </div>
                                          <p className="text-gray-650 leading-relaxed font-medium">{clo.description}</p>
                                          {linkedPlo && (
                                            <span className="text-[10px] text-indigo-750 font-bold block bg-indigo-50/50 py-0.5 px-1.5 rounded-md w-fit">
                                              Aligned to {linkedPlo.code}: {linkedPlo.title} ({clo.weight}% influence)
                                            </span>
                                          )}
                                        </div>
                                        <button
                                          onClick={() => handleDeleteCloNode(course.id, clo.id)}
                                          aria-label="Remove CLO Mapping"
                                          className="text-red-500 hover:text-red-800 font-bold"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* PROGRAM LEARNING OUTCOMES (PLOs) MATRIX VIEW */}
                <div className="border border-gray-150 rounded-xl p-5 bg-[#fafcfd] space-y-4">
                  <div className="flex justify-between items-center border-b pb-3 mb-1">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                        🎯 Accreditation Goals: Program Learning Outcomes (PLOs)
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Mapped against institutional competencies for Outcome-Based Education validation.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {activeProg?.plos.map((plo) => (
                      <div key={plo.id} className="bg-white border border-gray-250 p-4 rounded-xl flex items-start gap-3 shadow-2xs hover:shadow-xs transition-shadow">
                        <div className="bg-indigo-50 text-indigo-700 h-8 w-8 rounded-lg flex items-center justify-center font-extrabold text-xs font-mono shrink-0">
                          {plo.code}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-extrabold text-gray-900 leading-tight">{plo.title}</h4>
                          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{plo.description}</p>
                          <span className="text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded-md block w-fit">
                            Accreditation Group: {plo.accreditationDomain}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: ADDITIONAL COURSE & PLO REGISTRY */}
              <div className="space-y-4">
                <div className="bg-[#f8fafc] p-5 rounded-2xl border border-gray-150 space-y-5">
                  
                  {/* COURSE REGISTRY FORM */}
                  <form onSubmit={handleAddCourseMapping} className="bg-white p-4 rounded-xl border border-gray-100 space-y-3 shadow-2xs">
                    <span className="text-[10px] font-extrabold text-slate-705 text-slate-500 block uppercase font-mono tracking-wider border-b pb-1">
                      📚 Course Syllabus Registry
                    </span>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 block uppercase">Course Title</label>
                      <input
                        type="text"
                        placeholder="Deep Computational Logics"
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        className="text-xs border border-gray-200 hover:border-gray-400 p-2 rounded-lg w-full font-semibold outline-hidden text-gray-850"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 block uppercase">Course Code</label>
                        <input
                          type="text"
                          placeholder="COMP-390"
                          value={newCourseCode}
                          onChange={(e) => setNewCourseCode(e.target.value)}
                          className="text-xs border border-gray-200 hover:border-gray-400 p-2 rounded-lg w-full font-semibold outline-hidden text-gray-850"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 block uppercase">Credit Hours</label>
                        <select
                          value={newCourseCredits}
                          onChange={(e) => setNewCourseCredits(Number(e.target.value))}
                          aria-label="Select Credits"
                          className="text-xs border border-gray-200 hover:border-gray-400 p-2 rounded-lg w-full font-semibold outline-hidden cursor-pointer"
                        >
                          <option value="1">1 Cr. Hr.</option>
                          <option value="2">2 Cr. Hr.</option>
                          <option value="3">3 Cr. Hr.</option>
                          <option value="4">4 Cr. Hr.</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 block uppercase">Lecture Hours/wk</label>
                        <input
                          type="number"
                          value={newCourseLects}
                          onChange={(e) => setNewCourseLects(Number(e.target.value))}
                          className="text-xs border border-gray-200 hover:border-gray-400 p-2 rounded-lg w-full font-semibold outline-hidden"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 block uppercase">Lab Hours/wk</label>
                        <input
                          type="number"
                          value={newCourseLabs}
                          onChange={(e) => setNewCourseLabs(Number(e.target.value))}
                          className="text-xs border border-gray-200 hover:border-gray-400 p-2 rounded-lg w-full font-semibold outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <label className="text-[10px] font-bold text-gray-400 block uppercase">Pre-requisite Courses</label>
                      <select
                        multiple
                        value={coursePreReqs}
                        onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions).map(opt => (opt as HTMLOptionElement).value);
                          setCoursePreReqs(values);
                        }}
                        aria-label="Select Prerequisites"
                        className="text-xs border border-gray-200 hover:border-gray-400 p-2 rounded-lg w-full font-semibold outline-hidden h-16"
                      >
                        {activeSem?.courses.map(item => (
                          <option key={item.id} value={item.id}>{item.courseCode} - {item.title}</option>
                        ))}
                      </select>
                      <p className="text-[9.5px] text-gray-400 italic">Hold Ctrl or Cmd to select multiples.</p>
                    </div>

                    <button
                      type="submit"
                      aria-label="Append course mapping"
                      className="w-full bg-blue-600 hover:bg-blue-750 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Add Course to Semester
                    </button>
                  </form>

                  {/* ADD PROGRAM LEARNING OUTCOME FORM */}
                  <form onSubmit={handleAddPlo} className="bg-white p-4 rounded-xl border border-gray-100 space-y-3 shadow-2xs">
                    <span className="text-[10px] font-extrabold text-slate-505 text-slate-500 block uppercase font-mono tracking-wider border-b pb-1">
                      🎯 Add Program (PLO) Target
                    </span>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 block uppercase">PLO Code</label>
                        <input
                          type="text"
                          placeholder="PLO-5"
                          value={newPloCode}
                          onChange={(e) => setNewPloCode(e.target.value)}
                          className="text-xs border border-gray-200 p-2 rounded-lg w-full font-semibold outline-hidden"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 block uppercase">Alignment Domain</label>
                        <select
                          value={newPloDomain}
                          onChange={(e) => setNewPloDomain(e.target.value as any)}
                          aria-label="Select Domain"
                          className="text-xs border border-gray-200 p-2 rounded-lg w-full font-semibold outline-hidden cursor-pointer"
                        >
                          <option value="Knowledge">Knowledge Domain</option>
                          <option value="Skills">Skills Domain</option>
                          <option value="Attitude">Attitude Domain</option>
                          <option value="Ethical">Ethical Domain</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 block uppercase">PLO Title</label>
                      <input
                        type="text"
                        placeholder="Modern Software Synthesis & Tools"
                        value={newPloTitle}
                        onChange={(e) => setNewPloTitle(e.target.value)}
                        className="text-xs border border-gray-200 p-2 rounded-lg w-full font-semibold outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 block uppercase">Description</label>
                      <textarea
                        placeholder="Ability to select, design, adapt and apply state-of-the-art computational methods."
                        value={newPloDesc}
                        onChange={(e) => setNewPloDesc(e.target.value)}
                        className="text-xs border border-gray-200 p-2 h-14 rounded-lg w-full font-semibold outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      aria-label="Syllabus construct output click"
                      className="w-full bg-slate-900 hover:bg-black text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Register Target PLO
                    </button>
                  </form>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== TAB 3: OBE & BLOOM TAXONOMY ==================== */}
        {activeTab === "obe" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* STRENGTH ANALYTICS VIEW */}
              <div className="lg:col-span-2 space-y-5">
                
                {/* CHARTS CONTAINER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                  {/* CHART A: Bloom's Cognitive Levels Radar alignment */}
                  <div className="bg-white border border-gray-250 rounded-xl p-5 space-y-3">
                    <span className="text-xs font-bold text-slate-800 uppercase font-mono flex items-center gap-1">
                      📊 Bloom's Taxonomy Cognitive Depth
                    </span>
                    <p className="text-[10.5px] text-gray-400 italic font-medium leading-none">
                      Active count of learning goals across C1-C6 levels.
                    </p>

                    <div className="h-64 pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={bloomChartData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="level" tick={{ fill: '#475569', fontSize: 11, fontWeight: 'bold' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                          <Radar 
                            name="Curriculum Depth" 
                            dataKey="count" 
                            stroke="#4f46e5" 
                            fill="#818cf8" 
                            fillOpacity={0.4} 
                          />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* CHART B: PLO alignment weight */}
                  <div className="bg-white border border-gray-250 rounded-xl p-5 space-y-3">
                    <span className="text-xs font-bold text-slate-800 uppercase font-mono flex items-center gap-1">
                      🎯 PLO Accreditation Weight alignment
                    </span>
                    <p className="text-[10.5px] text-gray-400 italic font-medium leading-none">
                      Accumulated weight factors mapped across academic PLOs.
                    </p>

                    <div className="h-64 pt-2">
                      {ploChartData.reduce((acc, current) => acc + current.alignmentScore, 0) === 0 ? (
                        <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">
                          No PLOs are currently mapped to Course CLOs.
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ploChartData}>
                            <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 9 }} />
                            <Tooltip />
                            <Bar dataKey="alignmentScore" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Influence Weight (%)" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>

                {/* ACTIVE CORE CONCEPT CARD: RED-TEAM COMPLIANCE */}
                <div className="border border-indigo-150 rounded-2xl p-5 bg-indigo-50/20 flex flex-col md:flex-row items-center gap-5">
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl shrink-0">
                    💡
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-indigo-900 uppercase font-mono">What is OBE & Bloom Taxonomy?</h4>
                    <p className="text-[11.5px] text-gray-650 leading-relaxed font-medium">
                      Outcome-Based Education (OBE) ensures courses evaluate specific <strong>Program Learning Outcomes (PLOs)</strong>. Bloom's Taxonomy divides intellectual depth into six cascading levels (C1: Remember, to C6: Create). Mapping assessments directly to cognitive layers produces systematic transcripts and guarantees global accreditation compliance.
                    </p>
                  </div>
                </div>

                {/* BLOOM TAXONOMY REFERENCE RUBRIC */}
                <div className="border border-gray-150 rounded-xl bg-white p-5 space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase font-mono block">
                    📋 Bloom Taxonomy Cognitive Range Rubric
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-405 text-gray-400">C1</span>
                      <strong className="text-xs text-slate-800 block">Remember</strong>
                      <span className="text-[10px] text-gray-500 block leading-tight">Recall, label, define facts.</span>
                    </div>

                    <div className="bg-blue-50/30 border border-blue-100 p-2.5 rounded-lg text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold text-blue-400">C2</span>
                      <strong className="text-xs text-blue-800 block">Understand</strong>
                      <span className="text-[10px] text-gray-500 block leading-tight">Explain, summarize.</span>
                    </div>

                    <div className="bg-amber-50/30 border border-amber-100 p-2.5 rounded-lg text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold text-amber-500">C3</span>
                      <strong className="text-xs text-amber-800 block">Apply</strong>
                      <span className="text-[10px] text-gray-500 block leading-tight">Execute, compute, run.</span>
                    </div>

                    <div className="bg-indigo-50/30 border border-indigo-100 p-2.5 rounded-lg text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold text-indigo-400">C4</span>
                      <strong className="text-xs text-indigo-800 block">Analyze</strong>
                      <span className="text-[10px] text-gray-500 block leading-tight">Compare, structure.</span>
                    </div>

                    <div className="bg-purple-50/30 border border-purple-100 p-2.5 rounded-lg text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold text-purple-400">C5</span>
                      <strong className="text-xs text-purple-800 block">Evaluate</strong>
                      <span className="text-[10px] text-gray-500 block leading-tight">Critique, justify, rate.</span>
                    </div>

                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-2.5 rounded-lg text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-500">C6</span>
                      <strong className="text-xs text-emerald-800 block">Create</strong>
                      <span className="text-[10px] text-gray-500 block leading-tight">Design, compose, devise.</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: CLO & BLOOM TAXONOMY ALIGNER */}
              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-150 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-4 h-4 text-indigo-650" /> CLO mapping Center
                  </h3>

                  {editingCourseMapId ? (
                    (() => {
                      const allMappedCourses = activeSem?.courses || [];
                      const editingCourse = allMappedCourses.find(c => c.id === editingCourseMapId);
                      
                      if (!editingCourse) {
                        return (
                          <p className="text-xs text-gray-500 italic p-4 bg-white rounded-xl border">
                            Select a course from the 'Curriculum Builder' tab first to configure its CLOs.
                          </p>
                        );
                      }

                      return (
                        <form onSubmit={handleAddCloNode} className="bg-white p-4 rounded-xl border border-gray-100 space-y-3.5 shadow-2xs">
                          <div>
                            <span className="text-[9.5px] uppercase font-bold text-gray-400 block tracking-wider leading-none">Mapping Targets for:</span>
                            <span className="text-xs font-extrabold text-blue-900 block mt-1 leading-snug">{editingCourse.title}</span>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-405 text-gray-400 block uppercase">CLO Outcome Description</label>
                            <textarea
                              placeholder="Describe the competency (e.g., Build dynamic weights inside tensor pipelines without gradient leaks)"
                              value={newCloDesc}
                              onChange={(e) => setNewCloDesc(e.target.value)}
                              className="text-xs border border-gray-250 p-2.5 h-20 rounded-lg w-full font-semibold outline-hidden text-gray-850"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-400 block uppercase">Cognitive Band</label>
                              <select
                                value={newCloBloom}
                                onChange={(e) => setNewCloBloom(e.target.value as any)}
                                aria-label="Select Bloom Level"
                                className="text-xs border text-slate-800 border-gray-255 p-2 rounded-lg w-full font-semibold cursor-pointer"
                              >
                                <option value="C1">C1 - Remember</option>
                                <option value="C2">C2 - Understand</option>
                                <option value="C3">C3 - Apply</option>
                                <option value="C4">C4 - Analyze</option>
                                <option value="C5">C5 - Evaluate</option>
                                <option value="C6">C6 - Create</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-400 block uppercase">Influence weight (%)</label>
                              <input
                                type="number"
                                min="10"
                                max="100"
                                value={newCloWeight}
                                onChange={(e) => setNewCloWeight(Number(e.target.value))}
                                className="text-xs border border-gray-255 p-2 rounded-lg w-full font-semibold"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 block uppercase">Map to Target program outcome (PLO)</label>
                            <select
                              value={newCloPlo}
                              onChange={(e) => setNewCloPlo(e.target.value)}
                              aria-label="Map CLO to PLO"
                              className="text-xs border text-slate-800 border-gray-255 p-2 rounded-lg w-full font-semibold cursor-pointer"
                            >
                              {(activeProg?.plos || []).map(plo => (
                                <option key={plo.id} value={plo.id}>{plo.code} - {plo.title}</option>
                              ))}
                            </select>
                          </div>

                          <button
                            type="submit"
                            aria-label="Save CLO mapping"
                            className="w-full bg-blue-600 hover:bg-blue-755 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors"
                          >
                            Save Unified CLO Target
                          </button>
                        </form>
                      );
                    })()
                  ) : (
                    <div className="bg-white p-4 rounded-xl border text-center text-xs text-gray-400 italic">
                      Select a course in the "Curriculum Builder" tab to trigger active OBE mapping controls.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
