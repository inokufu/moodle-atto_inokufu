Inokufu Search - Moodle Atto Plugin
=================================

The Inokufu Search - Moodle Atto plugin is a part of the Inokufu Search Moodle Plugin set, which also includes the Inokufu Search - Moodle Repository plugin. This Moodle Atto plugin simplifies the interaction with the Inokufu Search - Moodle Repository plugin, by enabling users to embed content from the Moodle Repositories directly into the Atto text editor.
This documentation will guide you through the installation and usage of the plugin.

**Note:** This Moodle Plugin is only useful when combined with our `Inokufu Search - Moodle Repository Plugin`. Please be sure to have it installed and configured before installing this plugin.

Please find a French version of this documentation [here](./README.fr.md).

## Installation

### Installation from ZIP
1. Download the plugin zip file from this GitHub repository.
2. Log in to your Moodle site as an administrator.
3. Navigate to `Site administration > Plugins > Install plugins`.
4. Upload the zip file you downloaded from this GitHub repository and follow the on-screen instructions.
5. Complete and confirm the forms to finish the plugin installation.

### Installation from sources
1. Establish an SSH connection to your Moodle instance.
2. Clone the source files from this GitHub repository directly into your Moodle source files.
3. Rename the cloned folder to `inokufu`.
4. Move the `inokufu` folder into the `lib/editor/atto/plugins` directory of your Moodle installation. Ensure that the plugin folder is named `inokufu`.
5. Log in to your Moodle site as an administrator.
6. Navigate to `Site administration > Notifications` to finalize the plugin installation.

## Configuration
1. After successful installation, navigate to `Site administration > Plugins > Text Editors > Atto Toolbar Settings` to configure the plugin settings.
2. In the `Toolbar Configuration` text field, add a new row : `search = inokufu`, above the raw `files = (...)`.
3. Save changes, and start using our atto plugin.

## Usage
1. To add a new Learning Object to your Moodle Courses, navigate to the desired course, and turn editing on.
2. Add or edit any activity or resource of your course.
3. In any Atto text editor tool bar, you will find an Inokufu tab ; click on it to open your Moodle Repositories, and then select `Inokufu Search` on the left panel to open our Repository Plugin. 
4. Fill in your query by typing your text query, and editing default filters if needed. Launch the query by clicking on the `Search` button.
5. A list of Learning Objects should appear ; select the Learning Object you want by clicking on it. Click on select this file to confirm your choice.
6. A small window should open, asking you if you want to change the title of the Learning Object that will be displayed in your Moodle course. Click on `Add a Learning Object` to confirm the title and add the Learning Object.
7. Save and display the activity. Your students can now access to the Learning Object content by clicking on it.

**Note:** This use case is only possible if you have already installed our `Inokufu Search - Moodle Repository Plugin`.

## Troubleshooting
If you encounter any issues with the plugin, please check the following:
1. Ensure your Moodle site meets the minimum requirements for the plugin.
2. Verify that your API Key is correctly filled in, and valid.
3. Check the Moodle log (`Site administration > Reports > Logs`) for any error messages related to the plugin.
4. If none of these steps helped, feel free to contact our [Inokufu Support](https://support.inokufu.com/).

## Support
For additional support or to report a bug, please visit the plugin's GitHub repository and open an `issue`. Be sure to include any relevant details, such as your Moodle version, plugin version, and a detailed description of the issue.
