export const RoutinesCard=[
            {
                id: 1,
                name: "Rutina de Fuerza Total",
                author: "Usuario123", /* Id del usuario */
                isPublic: true,
                daysPerWeek: 3,
                difficulty:"Fácil",
                trainingLocation: "Gimnasio",
                dailyRoutines: {
                    Lunes: /*id del dia de la semana*/ {
                        blocks: [
                            {
                                muscleGroup: [1,2], /*ID del musculo o musculos a trabajar en este bloque*/
                                exercises: [
                                    {
                                        exerciseId: 1,
                                        sets: 3,
                                        reps: 10,
                                        restBetweenSets: 60,
                                        restAfterExercise: 120
                                    }
                                ]
                            }
                        ]
                    },

                }
            },
            {
                id: 2,
                name: "Pechos de operada",
                author: "Usuario123", /* Id del usuario */
                isPublic: true,
                daysPerWeek: 3,
                difficulty:"Medio",
                trainingLocation: "Gimnasio",
                dailyRoutines: {
                    Lunes: /*id del dia de la semana*/ {
                        blocks: [
                            {
                                muscleGroup: [1,2], /*ID del musculo o musculos a trabajar en este bloque*/
                                exercises: [
                                    {
                                        exerciseId: 1,
                                        sets: 3,
                                        reps: 10,
                                        restBetweenSets: 60,
                                        restAfterExercise: 120
                                    }
                                ]
                            }
                        ]
                    },

                }
            },
            {
                id: 3,
                name: "Patas como un poste",
                author: "Usuario123", /* Id del usuario */
                isPublic: true,
                daysPerWeek: 3,
                difficulty:"Difícil",
                trainingLocation: "Gimnasio",
                dailyRoutines: {
                    Lunes: /*id del dia de la semana*/ {
                        blocks: [
                            {
                                muscleGroup: [1,2], /*ID del musculo o musculos a trabajar en este bloque*/
                                exercises: [
                                    {
                                        exerciseId: 1,
                                        sets: 3,
                                        reps: 10,
                                        restBetweenSets: 60,
                                        restAfterExercise: 120
                                    }
                                ]
                            }
                        ]
                    }
                }
            },{
                id: 4,
                name: "Only Cardio",
                author: "Usuario123", /* Id del usuario */
                isPublic: true,
                daysPerWeek: 1,
                difficulty:"Fácil",
                trainingLocation: "Gimnasio",
                dailyRoutines: {
                    Lunes: /*id del dia de la semana*/ {
                        blocks: [
                            {
                                muscleGroup: [1,2], /*ID del musculo o musculos a trabajar en este bloque*/
                                exercises: [
                                    {
                                        exerciseId: 1,
                                        sets: 3,
                                        reps: 10,
                                        restBetweenSets: 60,
                                        restAfterExercise: 120
                                    }
                                ]
                            }
                        ]
                    }
                }
            },{
                id: 5,
                name: "La roca workout",
                author: "Usuario123", /* Id del usuario */
                isPublic: true,
                daysPerWeek: 6,
                difficulty:"Difícil",
                trainingLocation: "Gimnasio",
                dailyRoutines: {
                    Lunes: /*id del dia de la semana*/ {
                        blocks: [
                            {
                                muscleGroup: [1,2], /*ID del musculo o musculos a trabajar en este bloque*/
                                exercises: [
                                    {
                                        exerciseId: 1,
                                        sets: 3,
                                        reps: 10,
                                        restBetweenSets: 60,
                                        restAfterExercise: 120
                                    }
                                ]
                            }
                        ]
                    }
                }
            },{
                id: 6,
                name: "Entrenamiento para futbolistas",
                author: "Usuario123", /* Id del usuario */
                isPublic: true,
                daysPerWeek: 7,
                difficulty:"Medio",
                trainingLocation: "Gimnasio",
                dailyRoutines: {
                    Lunes: /*id del dia de la semana*/ {
                        blocks: [
                            {
                                muscleGroup: [1,2], /*ID del musculo o musculos a trabajar en este bloque*/
                                exercises: [
                                    {
                                        exerciseId: 1,
                                        sets: 3,
                                        reps: 10,
                                        restBetweenSets: 60,
                                        restAfterExercise: 120
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
]