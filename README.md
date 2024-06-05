# Cells Set up environment
This action set up the build environment for Cells
## Inputs

### configure-npm:
**Not Required** Flag to configure npm
**Default value** true
### configure-gradle:
**Not Required** Flag to configure gradle
**Default value** true
### configure-bower:
**Not Required** Flag to configure bower
**Default value** true
### repository-npm:
**Not Required** Repository to use for npm
**Default value** gl-bbva-npm-virtual
### artifactory-user:
**Not Required** Artifactory User
**Default value** ${{ secrets.ARTUSERNAME }}
### artifactory-password:
**Not Required** Artifactory User
**Default value** ${{ secrets.ARTPASSWORD }}

## Outputs

No outputs yet

## Example usage

```yaml
uses: actions/gl-cells-cicd-setup-env@0.0.1
```