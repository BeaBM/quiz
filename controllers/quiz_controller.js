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

exports.ownershipRequired = function(req,res,next){
  var objQuizOwner = req.quiz.UserId;
  var logUser = req.session.user.id;
  var isAdmin = req.session.user.isAdmin;

  if(isAdmin ||objQuizOwner === logUser){
    next();
  }else{
    res.redirect('/');
  }
};


//GET /quizes/:id
exports.show = function(req, res){
  console.log("ESTAMOS DENTRO DE SHOW");
  models.Quiz.find(req.params.quizId)
    .then(function(quiz){
      console.log("CONTROL DE FAVORITOS");
      //Control de favoritos
      var favo = 0 ;

      if(req.session.user){
        console.log("sí hay sesion");
        models.favourites.findAll({
            where: {QuizId: Number(req.params.quizId) },
            //  order: 'UserId ASC'
        })
        .then(function(a){
            console.log("ENCONTRO FAVORITOS");
            for(index = 0; index < a.length;index++){
              var resta = req.session.user.id - a[index].dataValues.UserId;            
              if(resta === 0 ){
                favo = 1;
              }
            }
          })
        .then(function(){
          res.render('quizes/show' , {quiz: req.quiz, errors: [], favo: favo });
        })
      }else{
          console.log("no registrado");
          res.render('quizes/show' , {quiz: req.quiz, errors: [], favo: favo });
      }
    })
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

/*
exports.busqueda = function(req, res){
  var x = req.query.formulario;
  var y = x.replace(/\s+/g, '%')+'%';
  models.Quiz.findAll({where: ["pregunta like ?", '%' + y + '%'], order: [["pregunta", 'ASC']]}).then(function(quizes){

    res.render('quizes/busqueda',{quizes: quizes});
  });

};
*/
// Autoload :id
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
            where: {id: Number(quizId) },
            include: [{ model: models.Comment }]
        }).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error){next(error)});
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
  req.body.quiz.UserId = req.session.user.id;
  

  if(req.files.image){
    req.body.quiz.image = req.files.image.name;
  }

  var quiz =models.Quiz.build(req.body.quiz);

  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta", "UserId", "image"]})
        .then( function(){ res.redirect('/quizes')}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  );
};

// PUT /quizes/:id
exports.update = function(req, res, next) {
  
  if(req.files.image){
    req.quiz.image = req.files.image.name;
  }


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
        .save( {fields: ["pregunta", "respuesta", "image"]})
        .then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  ).catch(function(error){next(error)});
};

//GET /quizes
exports.index = function(req, res, next){

  var options = {};
  var favs = [];

  if(req.user){
    options.where = {UserId: req.user.id}
  };

  //Control de favoritos
  if(req.session.user){
    models.favourites.findAll({
      where: {UserId: Number(req.session.user.id) },
      //order: 'QuizId ASC'
    })
    .then(function(a){
      for(index = 0; index < a.length;index++){
        favs.push(a[index].dataValues.QuizId);
      }
    })
  }
 
  if (req.query.formulario === undefined){
    models.Quiz.findAll(options).then(function(quizes){
      res.render('quizes/index.ejs',{quizes: quizes, errors:[], favs:favs});
    });
  }else{      
    var formulario= '%' +(String(req.query.formulario)).replace(/\s/g,"%")+'%';
    models.Quiz.findAll({
      where: ["pregunta like ?",formulario],
      order: ['pregunta']
    })
    .then(function(quizes){
      res.render('quizes/index.ejs',{quizes: quizes,errors:[], favs:favs});
    })
    .catch(function(error){next(error);});
  }
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};


