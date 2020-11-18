const router = require('koa-router')()
const controllers = require('../controllers/AdminControllers')

const config = require('../config')
const { logger } = require('../middlewares/logger')

const koaJwt = require('koa-jwt')({ secret: config.secret })

// 校验接口，进行登录验证后才能访问
router.use(koaJwt)


for (const url in controllers) {
  const delimiter = url.indexOf(' ');
  const method = url.slice(0, delimiter);
  const path = url.slice(delimiter + 1);

  if (path.startsWith('/api')) {
    switch (method) {
      case 'GET':
        router.get(path, controllers[url]);
        break;
      case 'POST':
        router.post(path, controllers[url]);
        break;
      case 'PUT':
        router.put(path, controllers[url]);
        break;
      case 'PATCH':
        router.patch(path, controllers[url]);
        break;
      case 'DELETE':
        router.del(path, controllers[url]);
        break;
      default:
        logger.error(`Invalid URL: ${url}`);
        break;
    }
  }
}

logger.info('Private routes registered')

module.exports = router
