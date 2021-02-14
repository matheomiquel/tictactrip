/**
 * @swagger
 * definitions:
 *  UserCreation:
 *   type: object
 *   required:
 *       - username
 *       - email
 *       - password
 *       - firstName
 *       - lastName
 *   properties:
 *       username:
 *           type: string
 *           minimum: 3
 *           maximum: 30
 *           default: toto
 *       email:
 *           type: string
 *           format: email
 *           default: toto@gmail.com
 *       password:
 *           type: string
 *           pattern: '^[a-zA-Z0-9]{3,30}$'
 *           default: tutu
 *       firstName:
 *           type: string
 *           default: titi
 *       lastName:
 *           type: string
 *           default: tata
 */

/**
 * @swagger
 * definitions:
 *  User:
 *   type: object
 *   properties:
 *       id:
 *           type: integer
 *       userName:
 *           type: string
 *           minimum: 3
 *           maximum: 30
 *       email:
 *           type: string
 *           format: email
 *       password:
 *           type: string
 *           pattern: '^[a-zA-Z0-9]{3,30}$'
 *       firstName:
 *           type: string
 *       lastName:
 *           type: string
 */


 /**
 * @swagger
 * definitions:
 *  login:
 *   type: object
 *   required:
 *       - email
 *       - password
 *   properties:
 *       email:
 *           type: string
 *           format: email
 *           default: toto@gmail.com
 *       password:
 *           type: string
 *           pattern: '^[a-zA-Z0-9]{3,30}$'
 *           default: tutu
 */
