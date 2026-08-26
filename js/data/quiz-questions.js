/**
 * js/data/quiz-questions.js
 * Banco de preguntas para "Preguntas Bíblicas". Cada pregunta da monedas
 * si se responde correctamente. Cada 10 aciertos se otorgan gemas extra
 * (ver js/quiz.js). Agregar una pregunta nueva = agregar un objeto aquí,
 * sin tocar la lógica de quiz.js.
 */
const QUIZ_QUESTIONS = [
  // ===== GÉNESIS =====
  { id: "q1", question: "¿En qué día de la creación formó Dios al hombre?", options: ["Cuarto", "Quinto", "Sexto", "Séptimo"], correctIndex: 2, verse: "Génesis 1:27", coins: 30 },
  { id: "q2", question: "¿Cómo se llamaba el primer hombre creado por Dios?", options: ["Set", "Adán", "Caín", "Enoc"], correctIndex: 1, verse: "Génesis 2:19-20", coins: 30 },
  { id: "q3", question: "¿De qué parte del cuerpo de Adán formó Dios a Eva?", options: ["Del corazón", "De una costilla", "Del brazo", "Del polvo"], correctIndex: 1, verse: "Génesis 2:22", coins: 30 },
  { id: "q4", question: "¿Quién mató a su hermano Abel?", options: ["Set", "Caín", "Enoc", "Lamec"], correctIndex: 1, verse: "Génesis 4:8", coins: 30 },
  { id: "q5", question: "¿Quién fue el hombre más longevo de la Biblia, con 969 años?", options: ["Adán", "Noé", "Matusalén", "Enoc"], correctIndex: 2, verse: "Génesis 5:27", coins: 30 },
  { id: "q6", question: "¿Quién construyó el arca antes del diluvio?", options: ["Abraham", "Noé", "Moisés", "Lot"], correctIndex: 1, verse: "Génesis 6:14", coins: 30 },
  { id: "q7", question: "¿Cuántos días y noches llovió durante el diluvio?", options: ["7", "40", "100", "12"], correctIndex: 1, verse: "Génesis 7:12", coins: 30 },
  { id: "q8", question: "¿Qué ave le confirmó a Noé que las aguas habían bajado?", options: ["Un cuervo", "Un águila", "Una paloma", "Una gaviota"], correctIndex: 2, verse: "Génesis 8:11", coins: 30 },
  { id: "q9", question: "¿Por qué Dios confundió las lenguas en la Torre de Babel?", options: ["Por un pecado sexual", "Porque querían alcanzar el cielo y desafiar a Dios", "Por idolatría", "Por una guerra"], correctIndex: 1, verse: "Génesis 11:7-9", coins: 30 },
  { id: "q10", question: "¿Cómo se llamaba la esposa de Abraham?", options: ["Rebeca", "Sara", "Lea", "Agar"], correctIndex: 1, verse: "Génesis 17:15", coins: 30 },
  { id: "q11", question: "¿En qué se convirtió la esposa de Lot al mirar atrás hacia Sodoma?", options: ["En piedra", "En estatua de sal", "En ceniza", "En árbol"], correctIndex: 1, verse: "Génesis 19:26", coins: 30 },
  { id: "q12", question: "¿Cómo se llamaba el hijo de la promesa que tuvieron Abraham y Sara?", options: ["Ismael", "Isaac", "Jacob", "Esaú"], correctIndex: 1, verse: "Génesis 21:3", coins: 30 },
  { id: "q13", question: "¿A qué hijo estuvo Abraham dispuesto a sacrificar en el monte Moriah?", options: ["Ismael", "Isaac", "Esaú", "Jacob"], correctIndex: 1, verse: "Génesis 22:2", coins: 30 },
  { id: "q14", question: "¿Quién fue el padre de Ismael, junto con Agar?", options: ["Isaac", "Abraham", "Lot", "Nacor"], correctIndex: 1, verse: "Génesis 16:15", coins: 30 },
  { id: "q15", question: "¿Cómo se llamaban los hijos gemelos de Isaac?", options: ["Jacob y Esaú", "Set y Caín", "Efraín y Manasés", "Coré y Datán"], correctIndex: 0, verse: "Génesis 25:24-26", coins: 30 },
  { id: "q16", question: "¿Qué vendió Esaú a Jacob por un plato de guiso de lentejas?", options: ["Su casa", "Su primogenitura", "Su rebaño", "Su esposa"], correctIndex: 1, verse: "Génesis 25:33", coins: 30 },
  { id: "q17", question: "¿Qué vio Jacob en su sueño camino a Harán?", options: ["Un carro de fuego", "Una escalera al cielo con ángeles", "Un arca", "Una serpiente"], correctIndex: 1, verse: "Génesis 28:12", coins: 30 },
  { id: "q18", question: "¿Con quién luchó Jacob toda una noche junto al río Jaboc?", options: ["Con Esaú", "Con un ángel", "Con un león", "Con Labán"], correctIndex: 1, verse: "Génesis 32:24-28", coins: 30 },
  { id: "q19", question: "¿Qué nuevo nombre le dio Dios a Jacob después de luchar con él?", options: ["Israel", "Judá", "Isaac", "Efraín"], correctIndex: 0, verse: "Génesis 32:28", coins: 30 },
  { id: "q20", question: "¿Cuántos hijos tuvo Jacob?", options: ["10", "12", "7", "9"], correctIndex: 1, verse: "Génesis 35:22-26", coins: 30 },
  { id: "q21", question: "¿Qué regalo de Jacob a José causó envidia en sus hermanos?", options: ["Un báculo de oro", "Una túnica de colores", "Un anillo", "Un rebaño"], correctIndex: 1, verse: "Génesis 37:3", coins: 30 },
  { id: "q22", question: "¿Qué hicieron los hermanos de José por celos?", options: ["Lo mataron", "Lo vendieron como esclavo", "Lo expulsaron de la familia", "Lo dejaron en el desierto"], correctIndex: 1, verse: "Génesis 37:28", coins: 30 },
  { id: "q23", question: "¿Quién compró a José al llegar a Egipto?", options: ["El Faraón", "Potifar", "Un sacerdote", "Un mercader"], correctIndex: 1, verse: "Génesis 37:36", coins: 30 },
  { id: "q24", question: "¿Quién interpretó los sueños del Faraón en Egipto?", options: ["José", "Moisés", "Daniel", "Salomón"], correctIndex: 0, verse: "Génesis 41:25", coins: 30 },
  { id: "q25", question: "¿Cómo se llamaba el hermano menor de José, también hijo de Raquel?", options: ["Rubén", "Simeón", "Benjamín", "Leví"], correctIndex: 2, verse: "Génesis 35:18", coins: 30 },

  // ===== ÉXODO =====
  { id: "q26", question: "¿En qué fue puesto el bebé Moisés para salvarlo de la muerte?", options: ["Una tinaja", "Una cesta de juncos", "Un carro", "Una tienda"], correctIndex: 1, verse: "Éxodo 2:3", coins: 30 },
  { id: "q27", question: "¿Quién encontró al bebé Moisés flotando en el río Nilo?", options: ["La esposa del Faraón", "La hija del Faraón", "Una esclava", "Su propia madre"], correctIndex: 1, verse: "Éxodo 2:5", coins: 30 },
  { id: "q28", question: "¿Cómo se le apareció Dios a Moisés en el desierto?", options: ["En un sueño", "En una zarza ardiente", "En una nube", "En un terremoto"], correctIndex: 1, verse: "Éxodo 3:2", coins: 30 },
  { id: "q29", question: "¿Cuántas plagas envió Dios sobre Egipto?", options: ["7", "10", "12", "3"], correctIndex: 1, verse: "Éxodo 7-12", coins: 30 },
  { id: "q30", question: "¿Cuál fue la última y más terrible plaga sobre Egipto?", options: ["Langostas", "Oscuridad", "Muerte de los primogénitos", "Granizo"], correctIndex: 2, verse: "Éxodo 12:29", coins: 30 },
  { id: "q31", question: "¿Qué mar se abrió para que Israel escapara de Egipto?", options: ["El Mar Muerto", "El Mar Rojo", "El Mar Mediterráneo", "El Mar de Galilea"], correctIndex: 1, verse: "Éxodo 14:21", coins: 30 },
  { id: "q32", question: "¿Qué alimento enviaba Dios cada mañana a Israel en el desierto?", options: ["Pan de trigo", "Maná", "Miel", "Aceite"], correctIndex: 1, verse: "Éxodo 16:15", coins: 30 },
  { id: "q33", question: "¿En qué monte recibió Moisés los Diez Mandamientos?", options: ["Sinaí", "Sion", "Carmelo", "Nebo"], correctIndex: 0, verse: "Éxodo 19:20", coins: 30 },
  { id: "q34", question: "¿Qué ídolo construyó el pueblo mientras Moisés estaba en el monte?", options: ["Un ídolo de plata", "Un becerro de oro", "Una serpiente de bronce", "Una estatua de piedra"], correctIndex: 1, verse: "Éxodo 32:4", coins: 30 },
  { id: "q35", question: "¿Cómo se llamaba el hermano de Moisés que hablaba por él ante el Faraón?", options: ["Aarón", "Josué", "Coré", "Caleb"], correctIndex: 0, verse: "Éxodo 4:14-16", coins: 30 },
  { id: "q36", question: "¿Quién condujo al pueblo de Israel fuera de Egipto?", options: ["Josué", "Aarón", "Moisés", "Samuel"], correctIndex: 2, verse: "Éxodo 3:10", coins: 30 },

  // ===== NÚMEROS / DEUTERONOMIO =====
  { id: "q37", question: "¿Cuántos espías se enviaron a explorar la tierra de Canaán?", options: ["2", "12", "7", "10"], correctIndex: 1, verse: "Números 13:2", coins: 30 },
  { id: "q38", question: "¿Cuántos años vagó Israel por el desierto antes de entrar a Canaán?", options: ["10", "20", "40", "70"], correctIndex: 2, verse: "Números 14:33", coins: 30 },
  { id: "q39", question: "¿Qué animal habló milagrosamente al profeta Balaam?", options: ["Un camello", "Una burra", "Un buey", "Un caballo"], correctIndex: 1, verse: "Números 22:28", coins: 30 },
  { id: "q40", question: "¿En qué monte murió Moisés sin entrar a la tierra prometida?", options: ["Sinaí", "Nebo", "Carmelo", "Horeb"], correctIndex: 1, verse: "Deuteronomio 34:1", coins: 30 },
  { id: "q41", question: "¿Quién sucedió a Moisés como líder de Israel?", options: ["Caleb", "Josué", "Aarón", "Finees"], correctIndex: 1, verse: "Deuteronomio 34:9", coins: 30 },

  // ===== JOSUÉ / JUECES / RUT =====
  { id: "q42", question: "¿Qué ciudad cayó tras siete vueltas y el sonido de trompetas?", options: ["Jericó", "Babilonia", "Nínive", "Sodoma"], correctIndex: 0, verse: "Josué 6:20", coins: 30 },
  { id: "q43", question: "¿Qué mujer de Jericó escondió y ayudó a los espías israelitas?", options: ["Rahab", "Débora", "Jael", "Rut"], correctIndex: 0, verse: "Josué 2:1-6", coins: 30 },
  { id: "q44", question: "¿Qué señal usó Gedeón para confirmar el llamado de Dios?", options: ["Un fuego que no se apagaba", "El vellón de lana con rocío", "Una voz del cielo", "Un arcoíris"], correctIndex: 1, verse: "Jueces 6:37", coins: 30 },
  { id: "q45", question: "¿De dónde sacaba Sansón su fuerza sobrenatural?", options: ["De su fe", "De su cabello", "De un amuleto", "De su armadura"], correctIndex: 1, verse: "Jueces 16:17", coins: 30 },
  { id: "q46", question: "¿Quién le cortó el cabello a Sansón mientras dormía?", options: ["Dalila", "Rahab", "Jael", "Su madre"], correctIndex: 0, verse: "Jueces 16:19", coins: 30 },
  { id: "q47", question: "¿Quién fue una jueza y profetisa que lideró a Israel?", options: ["Débora", "Rut", "Ana", "Ester"], correctIndex: 0, verse: "Jueces 4:4", coins: 30 },
  { id: "q48", question: "¿Quién le dijo a su suegra: \"donde tú vayas, iré yo\"?", options: ["Ester", "Rut", "Noemí", "Ana"], correctIndex: 1, verse: "Rut 1:16", coins: 30 },
  { id: "q49", question: "¿Con quién se casó Rut en Belén?", options: ["Booz", "Elimelec", "Quelión", "Obed"], correctIndex: 0, verse: "Rut 4:13", coins: 30 },

  // ===== 1-2 SAMUEL =====
  { id: "q50", question: "¿Cómo se llamaba la madre de Samuel, que oró intensamente por tener un hijo?", options: ["Ana", "Penina", "Rut", "Mical"], correctIndex: 0, verse: "1 Samuel 1:20", coins: 30 },
  { id: "q51", question: "¿Quién llamó al niño Samuel mientras dormía en el templo?", options: ["Elí", "Un ángel", "Dios", "Su madre"], correctIndex: 2, verse: "1 Samuel 3:4-10", coins: 30 },
  { id: "q52", question: "¿Quién fue el primer rey de Israel?", options: ["David", "Saúl", "Salomón", "Samuel"], correctIndex: 1, verse: "1 Samuel 10:1", coins: 30 },
  { id: "q53", question: "¿Quién ungió a David como futuro rey cuando aún era joven pastor?", options: ["Elí", "Samuel", "Saúl", "Natán"], correctIndex: 1, verse: "1 Samuel 16:13", coins: 30 },
  { id: "q54", question: "¿Con qué arma venció David a Goliat?", options: ["Espada", "Lanza", "Honda", "Arco"], correctIndex: 2, verse: "1 Samuel 17:50", coins: 30 },
  { id: "q55", question: "¿Quién fue el mejor amigo de David, hijo del rey Saúl?", options: ["Jonatán", "Abner", "Absalón", "Joab"], correctIndex: 0, verse: "1 Samuel 18:1", coins: 30 },
  { id: "q56", question: "¿Con quién cometió adulterio David, la esposa de Urías?", options: ["Betsabé", "Mical", "Abigail", "Tamar"], correctIndex: 0, verse: "2 Samuel 11:2-4", coins: 30 },
  { id: "q57", question: "¿Qué hijo de David se rebeló contra él y murió colgado de un árbol?", options: ["Salomón", "Amnón", "Absalón", "Adonías"], correctIndex: 2, verse: "2 Samuel 18:9-14", coins: 30 },

  // ===== 1-2 REYES / CRÓNICAS =====
  { id: "q58", question: "¿Qué rey de Israel construyó el primer templo en Jerusalén?", options: ["David", "Salomón", "Ezequías", "Josías"], correctIndex: 1, verse: "1 Reyes 6:1", coins: 30 },
  { id: "q59", question: "¿Qué reina visitó a Salomón atraída por su fama de sabiduría?", options: ["La reina de Sabá", "Ester", "Jezabel", "Atalía"], correctIndex: 0, verse: "1 Reyes 10:1", coins: 30 },
  { id: "q60", question: "¿Qué le pidió Salomón a Dios en lugar de riquezas o larga vida?", options: ["Poder militar", "Sabiduría", "Fama", "Salud"], correctIndex: 1, verse: "1 Reyes 3:9", coins: 30 },
  { id: "q61", question: "¿Quiénes alimentaban al profeta Elías junto al arroyo de Querit?", options: ["Ángeles", "Los cuervos", "Una viuda", "Los pastores"], correctIndex: 1, verse: "1 Reyes 17:6", coins: 30 },
  { id: "q62", question: "¿En qué monte Elías venció a los profetas de Baal?", options: ["Monte Sinaí", "Monte Carmelo", "Monte Sion", "Monte Nebo"], correctIndex: 1, verse: "1 Reyes 18:19-40", coins: 30 },
  { id: "q63", question: "¿Cómo subió Elías al cielo?", options: ["En un carro de fuego y un torbellino", "En una nube", "No murió, envejeció y desapareció", "Caminando"], correctIndex: 0, verse: "2 Reyes 2:11", coins: 30 },
  { id: "q64", question: "¿Quién fue el profeta que sucedió a Elías, recibiendo doble porción de su espíritu?", options: ["Eliseo", "Isaías", "Jeremías", "Abdías"], correctIndex: 0, verse: "2 Reyes 2:9-15", coins: 30 },
  { id: "q65", question: "¿Qué rey de Israel mandó matar a Nabot para quedarse con su viña?", options: ["David", "Saúl", "Acab", "Jehú"], correctIndex: 2, verse: "1 Reyes 21", coins: 30 },

  // ===== JOB =====
  { id: "q66", question: "¿Qué le permitió Satanás hacer a Job para probar su fe?", options: ["Solo enfermarlo", "Quitarle familia, salud y riquezas", "Matarlo", "Cegarlo"], correctIndex: 1, verse: "Job 1-2", coins: 30 },
  { id: "q67", question: "¿Cómo le respondió finalmente Dios a Job?", options: ["En silencio", "Desde un torbellino", "En un sueño", "A través de un ángel"], correctIndex: 1, verse: "Job 38:1", coins: 30 },
  { id: "q68", question: "¿Qué le sucedió a Job al final del libro?", options: ["Murió en pobreza", "Dios le restauró el doble de lo que tenía", "Perdió la fe", "Se quedó igual"], correctIndex: 1, verse: "Job 42:10", coins: 30 },

  // ===== SALMOS / PROVERBIOS =====
  { id: "q69", question: "¿Quién escribió la mayoría de los Salmos?", options: ["Salomón", "David", "Moisés", "Asaf"], correctIndex: 1, verse: "Salmos (encabezados)", coins: 30 },
  { id: "q70", question: "¿Qué Salmo comienza con \"Jehová es mi pastor, nada me faltará\"?", options: ["Salmo 1", "Salmo 23", "Salmo 100", "Salmo 150"], correctIndex: 1, verse: "Salmo 23:1", coins: 30 },
  { id: "q71", question: "¿Quién escribió la mayoría de los Proverbios?", options: ["David", "Salomón", "Job", "Ezequías"], correctIndex: 1, verse: "Proverbios 1:1", coins: 30 },
  { id: "q72", question: "Según Proverbios, ¿cuál es el principio de la sabiduría?", options: ["El estudio", "El temor de Jehová", "La riqueza", "La experiencia"], correctIndex: 1, verse: "Proverbios 9:10", coins: 30 },

  // ===== PROFETAS MAYORES =====
  { id: "q73", question: "¿Qué profeta es conocido como \"el profeta llorón\"?", options: ["Isaías", "Jeremías", "Ezequiel", "Daniel"], correctIndex: 1, verse: "Jeremías", coins: 30 },
  { id: "q74", question: "¿Qué libro escribió Jeremías lamentando la caída de Jerusalén?", options: ["Lamentaciones", "Salmos", "Job", "Eclesiastés"], correctIndex: 0, verse: "Lamentaciones 1:1", coins: 30 },
  { id: "q75", question: "¿Qué vio el profeta Ezequiel en un valle, que luego cobraron vida?", options: ["Piedras", "Huesos secos", "Árboles muertos", "Un río seco"], correctIndex: 1, verse: "Ezequiel 37:1-10", coins: 30 },
  { id: "q76", question: "¿Qué rey de Babilonia tuvo un sueño que Daniel interpretó?", options: ["Ciro", "Nabucodonosor", "Belsasar", "Darío"], correctIndex: 1, verse: "Daniel 2:1", coins: 30 },
  { id: "q77", question: "¿Quiénes fueron los tres jóvenes lanzados a un horno de fuego por no adorar un ídolo?", options: ["Sadrac, Mesac y Abed-nego", "David, Jonatán y Saúl", "Ananías, Misael y Azarías", "Los tres reyes magos"], correctIndex: 0, verse: "Daniel 3:19-27", coins: 30 },
  { id: "q78", question: "¿Qué apareció escrito en la pared durante el banquete del rey Belsasar?", options: ["Una profecía de paz", "\"Mene, Mene, Tekel, Uparsin\"", "El nombre de Dios", "Una advertencia de guerra"], correctIndex: 1, verse: "Daniel 5:25", coins: 30 },
  { id: "q79", question: "¿En el foso de qué animales sobrevivió Daniel?", options: ["Osos", "Leones", "Lobos", "Serpientes"], correctIndex: 1, verse: "Daniel 6:22", coins: 30 },

  // ===== PROFETAS MENORES =====
  { id: "q80", question: "¿Quién fue tragado por un gran pez tras huir del llamado de Dios?", options: ["Elías", "Jonás", "Job", "Isaías"], correctIndex: 1, verse: "Jonás 1:17", coins: 30 },
  { id: "q81", question: "¿A qué ciudad fue enviado Jonás a predicar arrepentimiento?", options: ["Babilonia", "Nínive", "Tarsis", "Jerusalén"], correctIndex: 1, verse: "Jonás 1:2", coins: 30 },
  { id: "q82", question: "¿Qué profeta se casó con una mujer infiel como símbolo de Israel?", options: ["Oseas", "Amós", "Joel", "Abdías"], correctIndex: 0, verse: "Oseas 1:2", coins: 30 },
  { id: "q83", question: "¿Qué profeta menor anunció que el Mesías nacería en Belén?", options: ["Nahúm", "Miqueas", "Sofonías", "Hageo"], correctIndex: 1, verse: "Miqueas 5:2", coins: 30 },

  // ===== EVANGELIOS: NACIMIENTO Y VIDA DE JESÚS =====
  { id: "q84", question: "¿Qué ángel anunció a María que sería madre del Mesías?", options: ["Miguel", "Gabriel", "Rafael", "Uriel"], correctIndex: 1, verse: "Lucas 1:26-31", coins: 30 },
  { id: "q85", question: "¿En qué ciudad nació Jesús?", options: ["Nazaret", "Belén", "Jerusalén", "Capernaúm"], correctIndex: 1, verse: "Lucas 2:4-7", coins: 30 },
  { id: "q86", question: "¿Quiénes fueron los primeros en visitar a Jesús recién nacido?", options: ["Los sabios de Oriente", "Los pastores", "Los sacerdotes", "Los soldados romanos"], correctIndex: 1, verse: "Lucas 2:8-16", coins: 30 },
  { id: "q87", question: "¿Qué guio a los sabios de Oriente hasta donde estaba Jesús?", options: ["Un ángel", "Una estrella", "Un sueño", "Una nube"], correctIndex: 1, verse: "Mateo 2:2-9", coins: 30 },
  { id: "q88", question: "¿A qué país huyó la familia de Jesús para escapar de Herodes?", options: ["Egipto", "Siria", "Babilonia", "Grecia"], correctIndex: 0, verse: "Mateo 2:14", coins: 30 },
  { id: "q89", question: "¿Quién bautizó a Jesús en el río Jordán?", options: ["Pedro", "Juan el Bautista", "Andrés", "Felipe"], correctIndex: 1, verse: "Mateo 3:13-16", coins: 30 },
  { id: "q90", question: "¿Cuántos días ayunó Jesús en el desierto siendo tentado?", options: ["7", "40", "12", "3"], correctIndex: 1, verse: "Mateo 4:2", coins: 30 },
  { id: "q91", question: "¿Cuántos apóstoles escogió Jesús?", options: ["10", "12", "7", "70"], correctIndex: 1, verse: "Mateo 10:1-4", coins: 30 },
  { id: "q92", question: "¿Cuál fue el primer milagro de Jesús, realizado en una boda?", options: ["Sanar a un ciego", "Convertir el agua en vino", "Multiplicar panes", "Calmar la tormenta"], correctIndex: 1, verse: "Juan 2:1-11", coins: 30 },
  { id: "q93", question: "¿Qué sucedió con Jesús durante la transfiguración ante sus discípulos?", options: ["Su rostro resplandeció como el sol", "Se convirtió en agua", "Desapareció", "Habló en otros idiomas"], correctIndex: 0, verse: "Mateo 17:2", coins: 30 },
  { id: "q94", question: "¿A quién resucitó Jesús después de 4 días de estar muerto?", options: ["Al hijo de la viuda", "A Lázaro", "A la hija de Jairo", "A un soldado"], correctIndex: 1, verse: "Juan 11:38-44", coins: 30 },
  { id: "q95", question: "¿Cuántos panes usó Jesús para alimentar a 5000 personas?", options: ["2", "5", "7", "12"], correctIndex: 1, verse: "Juan 6:9", coins: 30 },
  { id: "q96", question: "¿Sobre qué caminó Jesús para llegar a la barca de sus discípulos?", options: ["Sobre el agua", "Sobre la arena", "Sobre un puente", "No caminó, voló"], correctIndex: 0, verse: "Mateo 14:25", coins: 30 },
  { id: "q97", question: "¿Con qué mujer conversó Jesús junto a un pozo en Samaria?", options: ["Con María Magdalena", "Con la mujer samaritana", "Con Marta", "Con la hija de Jairo"], correctIndex: 1, verse: "Juan 4:7-26", coins: 30 },
  { id: "q98", question: "¿Qué recaudador de impuestos se subió a un árbol para ver a Jesús?", options: ["Mateo", "Zaqueo", "Leví", "Simón"], correctIndex: 1, verse: "Lucas 19:1-4", coins: 30 },
  { id: "q99", question: "¿Qué fariseo visitó a Jesús de noche preguntando cómo nacer de nuevo?", options: ["Nicodemo", "Gamaliel", "Caifás", "Anás"], correctIndex: 0, verse: "Juan 3:1-3", coins: 30 },
  { id: "q100", question: "¿Qué sanó Jesús en un hombre que era así desde su nacimiento?", options: ["La sordera", "La ceguera", "La parálisis", "La lepra"], correctIndex: 1, verse: "Juan 9:1-7", coins: 30 },
  { id: "q101", question: "¿A la hija de qué jefe de sinagoga resucitó Jesús?", options: ["Jairo", "Nicodemo", "Simón", "Zaqueo"], correctIndex: 0, verse: "Marcos 5:22-42", coins: 30 },
  { id: "q102", question: "¿Dónde pronunció Jesús las Bienaventuranzas?", options: ["En el templo", "En el monte", "En el mar de Galilea", "En Jerusalén"], correctIndex: 1, verse: "Mateo 5:1-2", coins: 30 },
  { id: "q103", question: "En la parábola del hijo pródigo, ¿cómo reacciona el padre cuando su hijo regresa?", options: ["Lo rechaza", "Lo recibe con alegría y una fiesta", "Lo castiga", "Lo ignora"], correctIndex: 1, verse: "Lucas 15:20-24", coins: 30 },
  { id: "q104", question: "¿Quién ayudó a un hombre herido en el camino, después de que un sacerdote y un levita lo ignoraran?", options: ["Un fariseo", "El buen samaritano", "Un romano", "Un discípulo"], correctIndex: 1, verse: "Lucas 10:30-34", coins: 30 },
  { id: "q105", question: "En la parábola del sembrador, ¿en cuántos tipos de terreno cayó la semilla?", options: ["2", "3", "4", "5"], correctIndex: 2, verse: "Mateo 13:3-8", coins: 30 },
  { id: "q106", question: "¿En qué animal entró Jesús a Jerusalén el Domingo de Ramos?", options: ["Un caballo blanco", "Un burrito/pollino", "Un camello", "A pie"], correctIndex: 1, verse: "Mateo 21:7", coins: 30 },
  { id: "q107", question: "¿Qué instituyó Jesús durante la Última Cena con sus discípulos?", options: ["El bautismo", "La Santa Cena (pan y vino)", "El lavado de pies solamente", "El sábado"], correctIndex: 1, verse: "Lucas 22:19-20", coins: 30 },
  { id: "q108", question: "¿En qué huerto oró Jesús angustiado antes de ser arrestado?", options: ["Getsemaní", "Edén", "Olivos altos", "Cedrón"], correctIndex: 0, verse: "Mateo 26:36", coins: 30 },
  { id: "q109", question: "¿Quién traicionó a Jesús por 30 monedas de plata?", options: ["Pedro", "Judas Iscariote", "Tomás", "Mateo"], correctIndex: 1, verse: "Mateo 26:15", coins: 30 },
  { id: "q110", question: "¿Cuántas veces negó Pedro conocer a Jesús antes de que cantara el gallo?", options: ["1", "2", "3", "5"], correctIndex: 2, verse: "Mateo 26:34,75", coins: 30 },
  { id: "q111", question: "¿Quién condenó a Jesús a morir en la cruz?", options: ["Herodes", "Poncio Pilato", "Caifás", "El Sanedrín"], correctIndex: 1, verse: "Mateo 27:24-26", coins: 30 },
  { id: "q112", question: "¿Qué sucedió con Jesús al tercer día después de morir?", options: ["Fue sepultado de nuevo", "Resucitó", "Ascendió directamente", "Nada, siguió en la tumba"], correctIndex: 1, verse: "Mateo 28:6", coins: 30 },
  { id: "q113", question: "¿Qué hizo Jesús 40 días después de resucitar?", options: ["Volvió a morir", "Ascendió al cielo", "Se escondió", "Fundó un templo"], correctIndex: 1, verse: "Hechos 1:9", coins: 30 },

  // ===== DISCÍPULOS Y APÓSTOLES =====
  { id: "q114", question: "¿Cuál era el nombre original del apóstol Pedro?", options: ["Simón", "Leví", "Natanael", "Judas"], correctIndex: 0, verse: "Mateo 4:18", coins: 30 },
  { id: "q115", question: "¿Quién fue el hermano de Pedro, también pescador y discípulo?", options: ["Santiago", "Andrés", "Juan", "Felipe"], correctIndex: 1, verse: "Mateo 4:18", coins: 30 },
  { id: "q116", question: "¿A qué discípulo se le llama \"el discípulo amado\"?", options: ["Pedro", "Santiago", "Juan", "Tomás"], correctIndex: 2, verse: "Juan 13:23", coins: 30 },
  { id: "q117", question: "¿Qué discípulo dudó de la resurrección hasta ver las heridas de Jesús?", options: ["Tomás", "Felipe", "Bartolomé", "Judas Tadeo"], correctIndex: 0, verse: "Juan 20:24-28", coins: 30 },
  { id: "q118", question: "¿Cuál era el oficio de Mateo antes de seguir a Jesús?", options: ["Pescador", "Recaudador de impuestos", "Carpintero", "Pastor"], correctIndex: 1, verse: "Mateo 9:9", coins: 30 },
  { id: "q119", question: "¿Qué discípulo caminó sobre el agua hacia Jesús pero comenzó a hundirse?", options: ["Juan", "Pedro", "Andrés", "Santiago"], correctIndex: 1, verse: "Mateo 14:29-30", coins: 30 },

  // ===== HECHOS =====
  { id: "q120", question: "¿Qué descendió sobre los discípulos el día de Pentecostés?", options: ["Fuego del cielo", "El Espíritu Santo", "Una nube", "Un ángel"], correctIndex: 1, verse: "Hechos 2:3-4", coins: 30 },
  { id: "q121", question: "¿Quién fue el primer mártir cristiano, apedreado hasta morir?", options: ["Esteban", "Santiago", "Felipe", "Bernabé"], correctIndex: 0, verse: "Hechos 7:59-60", coins: 30 },
  { id: "q122", question: "¿Cómo se llamaba el apóstol Pablo antes de su conversión?", options: ["Saulo", "Silas", "Simón", "Bernabé"], correctIndex: 0, verse: "Hechos 13:9", coins: 30 },
  { id: "q123", question: "¿Dónde tuvo Saulo su encuentro con Jesús que lo convirtió?", options: ["En Jerusalén", "Camino a Damasco", "En Roma", "En Antioquía"], correctIndex: 1, verse: "Hechos 9:3-4", coins: 30 },
  { id: "q124", question: "¿A quién bautizó Felipe en el camino a Gaza?", options: ["A un centurión romano", "Al eunuco etíope", "A un fariseo", "A un samaritano"], correctIndex: 1, verse: "Hechos 8:27-38", coins: 30 },
  { id: "q125", question: "¿Cómo escapó Pedro de la cárcel milagrosamente?", options: ["Sobornó a un guardia", "Un ángel lo liberó", "Escaló el muro", "Convenció al rey"], correctIndex: 1, verse: "Hechos 12:7-10", coins: 30 },

  // ===== EPÍSTOLAS / PABLO =====
  { id: "q126", question: "¿Cuántos viajes misioneros principales realizó el apóstol Pablo?", options: ["1", "2", "3", "5"], correctIndex: 2, verse: "Hechos 13-21", coins: 30 },
  { id: "q127", question: "¿Quién fue el compañero de Pablo en su primer viaje misionero?", options: ["Silas", "Bernabé", "Timoteo", "Lucas"], correctIndex: 1, verse: "Hechos 13:2-3", coins: 30 },
  { id: "q128", question: "¿A quién llamó Pablo \"verdadero hijo en la fe\" en sus cartas pastorales?", options: ["Tito", "Timoteo", "Filemón", "Epafrodito"], correctIndex: 1, verse: "1 Timoteo 1:2", coins: 30 },
  { id: "q129", question: "¿Qué le ocurrió al barco de Pablo camino a Roma?", options: ["Llegó sin problemas", "Naufragó", "Fue atacado por piratas", "Se hundió con toda la tripulación"], correctIndex: 1, verse: "Hechos 27:41", coins: 30 },
  { id: "q130", question: "¿Desde qué ciudad escribió Pablo varias de sus cartas estando preso?", options: ["Atenas", "Roma", "Corinto", "Éfeso"], correctIndex: 1, verse: "Hechos 28:16,30", coins: 30 },

  // ===== APOCALIPSIS =====
  { id: "q131", question: "¿En qué isla estaba Juan cuando recibió la visión de Apocalipsis?", options: ["Chipre", "Patmos", "Creta", "Malta"], correctIndex: 1, verse: "Apocalipsis 1:9", coins: 30 },
  { id: "q132", question: "¿A cuántas iglesias se dirige el libro de Apocalipsis al inicio?", options: ["3", "5", "7", "12"], correctIndex: 2, verse: "Apocalipsis 1:11", coins: 30 },
  { id: "q133", question: "¿Cuál es el número asociado con \"la bestia\" en Apocalipsis?", options: ["777", "666", "444", "888"], correctIndex: 1, verse: "Apocalipsis 13:18", coins: 30 },
  { id: "q134", question: "¿Cómo se llama la ciudad que desciende del cielo al final de Apocalipsis?", options: ["La Nueva Babilonia", "La Nueva Jerusalén", "Sion Eterna", "La Ciudad Santa de David"], correctIndex: 1, verse: "Apocalipsis 21:2", coins: 30 },
];