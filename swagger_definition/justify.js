 /**
 * @swagger
 * definitions:
 *  justify:
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