var models = require('../models/models.js');
/*
// GET /quizes/question
exports.question = function(req, res) {
  models.Quiz.findAll().success(function(quiz) {
    res.render('quizes/question', { pregunta: quiz[0].pregunta});
  })
};

// GET /quizes/answer
exports.answer = function(req, res) {
  models.Quiz.findAll().success(function(quiz) {
    if (req.query.respuesta === quiz[0].respuesta) {
      res.render('quizes/answer', { respuesta: 'Correcto' });
    } else {
      res.render('quizes/answer', { respuesta: 'Incorrecto'});
    }
  })
};
*/

//GET /quizes/:id
exports.show = function(req, res){
	  res.render('quizes/show', { quiz: req.quiz, errors: []});  
  };

exports.edit = function(req, res){
  var quiz = req.quiz; // autoload de instancia de quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};


// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
     resultado= 'Correcto';
    } 
      res.render('quizes/answer', { quiz:req.quiz,respuesta: resultado, errors: []});  
};

exports.busqueda = function(req, res){
  var x = req.query.formulario;
  var y = x.replace(/\s+/g, '%');
  models.Quiz.findAll({where: ["pregunta like ?", '%' + y + '%'], order: [["pregunta", 'ASC']]}).then(function(quizes){

    res.render('quizes/busqueda',{quizes: quizes});
  })

}
//Autoload - factoriza el código si ruta incluye :quizID
exports.load =function(req, res,  next, quizId){
  models.Quiz.find(quizId).then(
    function(quiz){
      if(quiz){
        req.quiz = quiz;
        next();
      }
      else {
        next (new Error('No existe quizId=' + quizId));
      }
    }).catch(function(error){ next(error);});
};

//GET /quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build( //crea objeto quiz 
  {
    pregunta: 'Pregunta', respuesta: 'Respuesta'
  });
  res.render ('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req, res){
  var quiz =models.Quiz.build(req.body.quiz);

  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes')}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  );
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  ).catch(function(error){next(error)});
};

//GET /quizes
exports.index = function(req, res){

  models.Quiz.findAll().then(function(quizes) {
  	res.render('quizes/index.ejs', { quizes: quizes, errors: []});

}).catch(function(error){next(error)});
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};


