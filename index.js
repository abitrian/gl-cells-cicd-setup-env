const core = require('@actions/core');
const github = require('@actions/github');
const shell = require('shelljs');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
});

try {

    // `configure-npm` 'Flag to configure npm'
    const configureNpm = core.getInput('configure-npm');
    const repositoryNpm = core.getInput('repository-npm');
    const repositoryBower = core.getInput('repository-bower');
    const repositoryGradle = core.getInput('repository-gradle');
    const artifactoryUser = core.getInput('artifactory-user');
    const artifactoryPass = core.getInput('artifactory-password');

    logger.info(`configureNpm :: ${configureNpm}`);
    logger.info(`repositoryNpm :: ${repositoryNpm}`);
    logger.info(`repositoryBower :: ${repositoryBower}`);
    logger.info(`repositoryGradle :: ${repositoryGradle}`);

    if (configureNpm) {
        logger.info('Set up Artifactory registry');
        shell.exec(`npm config set registry https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/${repositoryNpm};`);

        logger.info('Generate token for Artifactory');
        shell.exec(`TOKEN=$(curl -s -u${{artifactoryUser}}:${{artifactoryPass}} https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/auth --insecure | grep _auth)`);

        logger.info('Store token for Artifactory');
        shell.exec("echo //artifactory.globaldevtools.bbva.com/artifactory/api/npm/:$TOKEN >> ~/.npmrc");
    }

} catch (error) {
    core.setFailed(error.message);
}