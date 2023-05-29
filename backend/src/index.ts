import app from './app';
import logger from './common/logger';

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});

export default app;
