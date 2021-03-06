var express = require('express');
var multer = require('multer');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js')
var commentController = require('../controllers/comment_controller.js');
var sessionController = require('../controllers/session_controller.js');
var statisticsController = require('../controllers/statistics_controller');
var userController = require('../controllers/user_controller');
var favController = require('../controllers/fav_controller');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' , errors: []})
});
  router.get('/author', function(req, res) {
  res.render('author', { autores: 'Beatriz Barakat Melián y Jonathan Hurtado Yrula', errors: [] })
});

//AUtoload de comandos con quizId
router.param('quizId', quizController.load); //autoload quizId
router.param('commentId', commentController.load); //autoload commentId
router.param('userId', userController.load); //autoload userId

/*
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);
*/
// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
//router.get('/busqueda',                    quizController.index);
router.get('/quizes/new',                  sessionController.loginRequired, quizController.new);
router.post('/quizes/create', 			   sessionController.loginRequired, multer({dest:'./public/media/'}), quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.ownershipRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, multer({dest:'./public/media/'}), quizController.ownershipRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired, quizController.ownershipRequired, quizController.destroy);
// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',   commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',   commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', 
	                                    sessionController.loginRequired, commentController.ownershipRequired, commentController.publish);

//Definición de rutas Users
router.get('/user', userController.new);
router.post('/user', userController.create);
router.get('/user/:userId(\\d+)/edit',		sessionController.loginRequired, userController.ownershipRequired, userController.edit);
router.put('/user/:userId(\\d+)', 			sessionController.loginRequired, userController.ownershipRequired, userController.update);
router.delete('/user/:userId(\\d+)', 		sessionController.loginRequired, userController.ownershipRequired, userController.destroy);
router.get('/user/:userId(\\d+)/quizes',	sessionController.loginRequired, userController.ownershipRequired, quizController.index);

//Definición de la ruta favoritos
//Definicion de rutas para favoritos
router.put('/user/:userId(\\d+)/favourites/:quizId(\\d+)', sessionController.loginRequired, favController.new);
router.delete('/user/:userId(\\d+)/favourites/:quizId(\\d+)', sessionController.loginRequired, favController.destroy);
router.get('/user/:userId(\\d+)/favourites', sessionController.loginRequired, favController.listFav);



// Definición de rutas de sesion
router.get('/login',  sessionController.new);     // formulario login
router.post('/login', sessionController.create);  // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión


//Definición de rutas de estadísticas
router.get('/quizes/statistics', statisticsController.show);


module.exports = router;
