const core = require('@actions/core');
const github = require('@actions/github');
const shell = require('shelljs');
const winston = require('winston');
const exec = require('node:child_process');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
    ]
});

try {

    // `configure-npm` 'Flag to configure npm'
    const configureNpm = core.getInput('configure-npm');
    const repositoryNpm = core.getInput('repository-npm');
    const repositoryBower = core.getInput('repository-bower');
    const repositoryGradle = core.getInput('repository-gradle');
    const artifactoryUser = core.getInput('artifactory-user');
    const artifactoryPass = core.getInput('artifactory-password');
    let TOKEN = '';

    logger.info(`configureNpm :: ${configureNpm}`);
    logger.info(`repositoryNpm :: ${repositoryNpm}`);
    logger.info(`repositoryBower :: ${repositoryBower}`);
    logger.info(`repositoryGradle :: ${repositoryGradle}`);

    if (configureNpm) {
        logger.info('Set up Artifactory registry :: ');
        shell.exec(`npm config set registry https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/${repositoryNpm};`);
        shell.exec("cat ~/.npmrc");

        logger.info('Generate token for Artifactory :: ');
        /*shell.exec(`TOKEN=$(curl -s -u${{artifactoryUser}}:${{artifactoryPass}} https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/auth --insecure | grep _auth)`);
        shell.exec("cat ~/.npmrc");*/
        exec(`curl -s -u${{artifactoryUser}}:${{artifactoryPass}} https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/auth --insecure | grep _auth`, (error, stdout, stderr) => {
            logger.info("STDOUT:", stdout, ", STDERR:", stderr);
            TOKEN = stdout;
        });

        logger.info('Store token for Artifactory');
        shell.exec(`echo //artifactory.globaldevtools.bbva.com/artifactory/api/npm/:$TOKEN >> ~/.npmrc`);
        shell.exec("cat ~/.npmrc");
    }

} catch (error) {
    core.setFailed(error.message);
}