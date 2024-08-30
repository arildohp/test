import router from '@adonisjs/core/services/router'
import UploadsController from '#controllers/uploads_controller'

router.post('/upload', [UploadsController, 'upload'])

