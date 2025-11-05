import { logger } from '../../lib/logger.js';

export default function infoFeature() {
  logger.info('--------------------------------------------------');
  logger.info(
    'This project is open source and actively maintained by Roketin.',
  );
  logger.info('');
  logger.info(
    'We welcome feedback, suggestions, and improvements from the community.',
  );
  logger.info(
    'If you have ideas, issues, or contributions, feel free to reach out or submit MRs.',
  );
  logger.info('Website: https://roketin.com');
  logger.info(
    'Repository: temporarily in github.com/roketin/reactjs-base-project',
  );
  logger.info('Thank you for supporting open development!');
  logger.info('');
  logger.info('Author & Frontend Team:');
  logger.info('- Imam');
  logger.info('- Teguh');
  logger.info('- Naufal');
  logger.info('- Rafli Jatnika');
  logger.info('--------------------------------------------------');
}
