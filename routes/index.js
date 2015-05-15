var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js')



/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' , errors: []})
});
  router.get('/author', function(req, res) {
  res.render('author', { autores: 'Beatriz Barakat Melián y Jonathan Hurtado Yrula' })
});

//AUtoload de comandos con quizId
router.param('quizId', quizController.load); //autoload quizId
/*
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);
*/
// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/busqueda',                    quizController.busqueda);
router.get('/quizes/new',                  quizController.new);
router.post('/quizes/create', 			   quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   quizController.edit);
router.put('/quizes/:quizId(\\d+)',        quizController.update);
router.delete('/quizes/:quizId(\\d+)',        quizController.destroy);

module.exports = router;
