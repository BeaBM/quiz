var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js')
var commentController = require('../controllers/comment_controller.js');
var sessionController = require('../controllers/session_controller.js');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' , errors: []})
});
  router.get('/author', function(req, res) {
  res.render('author', { autores: 'Beatriz Barakat Melián y Jonathan Hurtado Yrula' })
});

//AUtoload de comandos con quizId
router.param('quizId', quizController.load); //autoload quizId
router.param('commentId', commentController.load); //autoload commentId

/*
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);
*/
// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/busqueda',                    quizController.busqueda);
router.get('/quizes/new',                  sessionController.loginRequired, quizController.new);
router.post('/quizes/create', 			   sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired, quizController.destroy);
// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',   commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',   commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', 
	                                    sessionController.loginRequired, commentController.publish);

// Definición de rutas de sesion
router.get('/login',  sessionController.new);     // formulario login
router.post('/login', sessionController.create);  // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión




module.exports = router;
