*Copyright © 2022 Knowmadics, Inc. The information contained in this user manual is the property of Knowmadics and further dissemination is prohibited without the written permission of Knowmadics.*

# Welcome


The 360° Portal is where you, as the System Admin, manage your workspaces, users, global settings, and audit reports. 

## System Requirements

### Browser Support

The latest version of Chrome (recommended), Firefox, Safari, Edge, iOS Safari, or Android is supported for your workspace.

## Getting Started

Before you can access the 360° Aware® Portal, you will be invited to the system. Once invited, you’ll receive an email with a link to the Portal.

### Accept Invitation

Once you accept the invitation, you’ll be asked to create your password. Once you have entered your password, click **SIGN IN**. 



## User Interface

### Primary Toolbar


The Primary Toolbar is at the top of the page and contains the Main Menu, Screen Title, Portal brand logo, Help button, and Account Menu button.

### Main Menu 

The Main Menu provides quick navigation to top-level destinations within the Portal.  The menu contains the following options: **Overview** :material-home-variant:, **Workspaces** :material-domain:, **Portal Users** :material-shield-check:, **Global Settings** :material-cog:, **Services**, **System Notifications** :material-bell:, **Rules** :material-list-status:, **Audit Reports** :material-clipboard-check: and **Reports** :material-chart-line-variant:. Click the chevron button **>** at the bottom of the Main Menu to collapse to a narrower view.

### Account Menu  

In the **Account Menu** :material-account-circle:, located in the top right corner of the main toolbar, you can access your user profile, switch to dark mode, sign out, and get the Portal version number.

#### Profile

In **Account Menu > Portal User Profile**, the profile page has two information cards: User Profile and Region. 

1. In User Profile, you can edit your user information, including Role. The two roles in the System Admin Portal are System Admin (full access) and System Viewer (read only access). 
2. In the Region card, your time zone is automatically set unless you toggle off the **Set time zone automatically** switch. You can also set your Language from the available choices in the dropdown (English, Arabic, or French CA). 

#### Dark Mode

In the **Account Menu**, click **Dark Mode** to change the color of the application from a light theme to a dark theme.

#### Sign Out

In the **Account Menu**, click **Sign Out** :material-exit-to-app: to sign out and be brought back to your Sign In URL.

#### About

In the **Account Menu**, click **About** to view the Portal version number you are running.

## Using the Portal

The Overview (or home) screen contains a main menu on the left sidebar that includes Administration: :material-domain: **Workspaces**, :material-shield-check: **Portal Users** and :material-cog: **Global Settings**, Tools: **Services**, :material-bell: **System Notifications** and :material-list-status: **Rules**, and Reports & Analytics: :material-clipboard-check: **Audit Reports** and :material-chart-line-variant: **Reports**.

## Global Settings

Before setting up workspaces and portal users or exploring the Overview screen, the first step in using the System Admin Portal is choosing your Global Settings.

Click the **Global Settings** :material-cog: icon on the main menu sidebar to open the Global Settings screen. The screen contains five tabs: Licensing, Integrations, Mapping, Security, and Trackers.

## Licensing 

In **Main Menu > Global Settings**, in the Licensing tab, there are three panels: License Key, Contact, and License Report. 

### License Key
In **Global Settings > Licensing**, you’ll see the listing of software you have licensed from Knowmadics. 

Edit any of your license keys by selecting the **Quick Actions** :material-dots-vertical: button and clicking **Edit** :material-pencil:. Enter the key, and click **SAVE**. 

!!! note "NOTE"

	If you have typed an invalid key, you'll receive an error message. 

### Contact

In **Global Settings > Licensing**, refer to the Contact panel if you need to renew your license. If you are having an issue applying your license key, contact support though the service desk.

### License Report

In **Global Settings > Licensing**, you'll need to provide Sales a copy of the License Report when renewing your license. Use the **Copy** button to copy the license report to the clipboard so it can be easily shared.


##  Integrations

In **Main Menu > Global Settings**, in the Integrations tab, there are dropdown menus for each of the following. When making changes, click **SAVE** for each item. 

!!! note "NOTE"

	Some changes will require a restart of services affected. The system will prompt you to **Save and Restart Later** or **Save and Restart** now. 

###  Active Directory

In **Global Settings > Integrations**, click the **Active Directory** dropdown. Toggle on the **Enable Active Directory** switch to enable Azure Active Directory SSO (Single Sign-On). This will enable users to access multiple applications with a single set of credentials. 

!!! danger "IMPORTANT"

	When entering numbers in Active Directory itself, please remember to put + sign in front of the country code, or you will receive errors. 

1. Enter the LDAP User Connection URL. The URL has the following format: LDAP://HostName[:PortNumber][/DistinguishedName]. If no port number is specified, the LDAP provider uses the default port number. **Note:** The default port number is 389, if not using an SSL connection, and 636 if using an SSL connection.
2. The LDAP Group Connection URL was meant for organizations with a large/diverse Active Directory structure with many groups, but it is no longer necessary to add this URL, as the AD Group names are now cached to the database during the Sync. **Please only use the Group Connection URL if requested by Knowmadics.**
3. Enter an LDAP Username and Password if applicable.  
4. Enter the Sync Rate (minutes). Allowable units range from 0-1440.
5. Click **Test User Connection** to see if your connection is successful.
6. Select **Sync Now** if you'd like to immediately sync; otherwise, syncing will occur at the rate you chose in Step 4.
7. You will see a sync status message at the bottom of the form.
8. Click **SAVE**.



!!! tip "NOTE"

	For more information on the LDAP Connection URLs for Active Directory, see this [Microsoft document](https://docs.microsoft.com/en-us/windows/desktop/adsi/ldap-adspath). 


###  App Invitation 

In **Global Settings > Integrations**, click the **App Invitation** dropdown, and you will see a list of all mobile apps, the Android version number (if applicable), the iOS version number (if applicable), App Invite text, and Invite URL. This is where you can edit the app invitation that is sent to users. 

1. To edit, click the **Edit** :material-pencil: button at the end of any row. This will open the Edit App Invitation dialog. 
2. If any field is grayed, then it is read-only. Edit other fields as needed.
3. The Dynamic Link is also read-only. If it has been enabled in your workspace in **Settings > App Invitation**, it will remove the ability for a Workspace Admin to change the App Invite Text and Download Link. The ability to make any app the Default App for that workspace will remain. 
4. Click **SAVE** after you have finished making edits.

###  AGPS (Ublox) 

In **Global Settings > Integrations**, Assisted GPS software (AGPS) is a system that enhances GPS positioning services using u-blox’s AssistNow services, reducing satellite fix time, improving accuracy in weak signal areas, and optimizing power consumption for seamless location tracking. 

1. To enable AGPS (Ublox), Click the **AGPS (Ublox)** dropdown.
2. Enter the Server name and Port number. 
3. Enter the Username and AGPS_PASS (password), Offline Server, and Offline Port. 
4. Click **SAVE** to enable AGPS for the workspace.

###  Data Ingestion Server

In **Global Settings > Integrations**, the Data Ingestion Server plays a crucial role in the data pipeline, enabling the collection, consolidation, and storing of data from diverse sources into a unified and accessible format for further analysis, reporting, or storage.

1. Click the **Data Ingestion Server** dropdown.
2. Enter the IPv4 Address for the data ingestion server.
2. Enter the Server DNS. This is the user-friendly host name associated with the above IP address.  It is optional, though leaving it blank means that tracker devices must connect to IP address.  This field is limited to 50 characters.
3. Click **SAVE**.  


###  EdgeVis (VMS)

In **Global Settings > Integrations**, click the **EdgeVis (VMS)** dropdown. EdgeVis (Video Management System) is a secure, low-bandwidth video streaming and management platform that ensures high-quality remote access video streaming. 

There is an additional setting required in the Workspace settings (for each workspace) in **Settings > Third Party Integrations > EdgeVis** requiring the EdgeVis server address and username/password. It is a multi step process, and the camera will be added automatically if it's “online.” For additional details for on-premise set up, please refer to the 360° Aware installation guide.

###  FEMA IPAWS

In **Global Settings > Integrations**, click the **FEMA IPAWS** dropdown. Enabling FEMA IPAWS will ensure fast and reliable communication during critical events with real-time emergency alerts across communication platforms and public warning systems. 

Turn on FEMA IPAWS by typing in the URL and the PIN. Click **SAVE**. 

###  Files

In **Global Settings > Integrations**, click the **Files** dropdown. Here you can control the upload size of files uploaded in your workspace. Set the Max Upload Size in megabytes for files uploaded to Projects/Operations in the field labeled Max Upload Size (MB). Click **SAVE**. 

###  Genetec (VMS)

In **Global Settings > Integrations**, click the **Genetec (VMS)** dropdown. Genetec (Video Management System) provides centralized control over video data, allowing users to capture, store, and manage video streams across sources in real-time. 

1. Toggle **Enable Genetec** on if you have workspaces that will be using this VMS. 
2. You will need to enter the Genetec MAC Address if you have a customer account with Genetec. If you only have a demo account, you will need to enter the Genetec Certificate string.
3. Click **SAVE**. 
2. Workspace Admins will then need to enter the credentials within the workspace in **Main Menu > Settings > Third Party Integrations > Genetec** to complete integration.

### Globalstar SPOT

In **Global Settings > Integrations**, click the **Globalstar SPOT** dropdown. Globalstar SPOT offers reliable satellite communication for safety and tracking in remote areas.  

1. Enable the Globalstar SPOT device for use in your workspace by turning the **Polling** switch on.
2. Next, choose a Polling Rate, in seconds, for sending requests to the SPOT network for the device's location. The polling rate must be between 20 and 1,000 seconds. 
3. Click **SAVE**. 

###  Incoming Email (POP3)

In **Global Settings > Integrations**, click the **Incoming Email (POP3)** dropdown. Incoming Email (Post Office Protocol version 3) allows you to easily retrieve and store your emails locally for offline access. 

To enable, enter the Email address, Password, Server, and Port. Click **SAVE**. 

### Media Server

In **Global Settings > Integrations**, the **Media Server** dropdown contains an **Enable Wowza** switch.  Wowza is the software platform used by Knowmadics for streaming media services and delivering live video and audio. 

If you do not need live streaming services for Collects, switch the **Enable Wowza** toggle off. Click **SAVE**. 

###  Motorola IMW Radios

In **Global Settings > Integrations**, click the **Motorola IMW Radios** dropdown. Motorola IMW Radios provide secure communication for mission-critical operations. 

1. Switch the **Motorola IMW Radios** toggle on to enable Motorola IMW Radios for all workspaces. 
2. Click **SAVE**. This will enable users to configure the Motorola settings within the workspace in **Main Menu > Settings > Third Party Integrations > Motorola IMW Radios** for their workspace. 

### NENA PSAP

In **Global Settings > Integrations**, click the **NENA PSAP** dropdown. NENA PSAP (National Emergency Number Association Public Safety Answering Point) enables efficient emergency call handling and response/support coordination. 

1. Slide the **Enable NENA PSAP** toggle on to enable NENA PSAP for all workspaces. 
2. Enter your NENA PSAP Username and Password. 
3. Click **SAVE**. This will allow users to enable NENA PSAP for chosen workspaces in **Main Menu > Workspaces > Workspace > Configuration > NENA PSAP**. 

###  Notification (Firebase)

In **Global Settings > Integrations**, click the **Notification (Firebase)** dropdown. Slide the **Enable Firebase** toggle on to enable Firebase push notifications for users in your workspace. Enter the Firebase URL. The applications to which you have access appear in the table for you to manage. 

3. Clicking the **Filter** :material-filter-variant: button will allow you to filter the table by Date Created. 
4. Clicking the **Quick** **Actions** :material-dots-vertical: button at the end of each row will give you options to **Deactivate** the application or **Delete Firebase Application**. 
5. To create a new Firebase Application, select the **New Firebase Application** :material-pencil: button in the header row of the table. 
6. Enter the Project Name, Project Server Key, Application Name, and switch the Active toggle on if the project is currently active. 
7. Click **SAVE**. 

###  Ovation Flashback

In **Global Settings > Integrations**, click the **Ovation Flashback** dropdown. Ovation Flashback is a video management system (VMS) that provides scalable video surveillance, recording, and management.

1. Slide the **Enable Ovation Flashback** toggle on if you have workspaces that will be using the Ovation Flashback video management system (VMS). 
2. Click **SAVE**.
2. Workspace Admins will then need to enter the credentials within the workspace in **Main Menu > Settings > Third Party Integrations > Ovation Flashback** to complete integration.

### Outgoing Email (SMTP)

In **Global Settings > Integrations**, click the **Outgoing Email (SMTP)** dropdown. Outgoing Email (Simple Mail Transfer Protocol) ensures secure email delivery from the workspace to recipients. 

1. Enter the Server name, Port, Username, From Email address, From Email Name, and Password. 
2. Enter a data retention choice in the next fields, to permanently delete emails after a Value and Unit of time, or choose **Never**. 
3. Click **Save**. 

### Outgoing Iridium

In **Global Settings > Integrations**, click the **Outgoing Iridium** dropdown. Enabling Outgoing Iridium will send data and communication via the Iridium satellite network. For Landguard Iridium and MetOcean Iridium devices, choose to send outgoing commands via Email or Direct IP. 

1. If you choose Email, you’ll need to enter the email address for the outgoing device commands and select **Save**.
2. If you choose Direct IP, enter the Direct IP Hostname and the Direct IP Port. Select **Save** and click **Test Connection** after saving to verify that the server is whitelisted by Iridium. 

### Personnel Logistics Certificates

In **Global Settings > Integrations**, click the **Personnel Logistics Certificates** dropdown. Here you can add or delete certificates needed for travel to certain destinations, which will then be enabled at the workspace level in **Settings**. 

1. To edit any of the names of the current certificates, click the **Edit** :material-pencil: button at the end of the certificate row. Change the name and click **SAVE**.  
2. To delete the certificates, click the **Delete** :material-delete: button at the end of any certificate row. 
3. To add a new certificate, scroll to the bottom of the list, and click **+ Add new certificate**. Type the certificate name in the Name field and click **SAVE**.

### SMS (Twilio, SMS Eagle)

In **Global Settings > Integrations**, click the **SMS (Twilio, SMS Eagle)** dropdown. These SMS (Short Messaging Service) integrations will allow users to send and receive SMS commands through the workspace. 

1. Choose between Twilio and SMS Eagle for your SMS provider. Twilio is a cloud-based communications platform providing global, scalable messaging. SMS Eagle is a hardware-based SMS device designed for local, offline, or high-security needs. 
1. When choosing Twilio, you must enter the Account SID, Authorization Token, Application SID, Messaging Service SID, Gateway Phone Number, Short Code, Short Code Help message, Short Code Stop message, and Short Code Start message. To test that Twilio SMS is connected and working, add a mobile phone number in the last field to receive a confirmation SMS. If the confirmation message does not go through, you will see an error message in the Portal. 
1. When choosing SMS Eagle, enter the URL, Access Token, Username, Password, Gateway Phone Number, Inbox Expiry, and Outbox Expiry. To test that SMS Eagle is connected and working, add a mobile phone number in the last field to receive a confirmation SMS. If the confirmation message does not go through, you will see an error message in the Portal.
2. Enter a data retention choice in the next fields, to permanently delete SMSs after a Value and Unit of time, or choose **Never**. 
1. Click **SAVE** before leaving the form. 

### URL Shortener 

In **Global Settings > Integrations**, click the **URL Shortener** dropdown. The URL shortener ensures that all links (Live Links, etc.) are sent with a shortened URL and do not get blocked by cellular carriers when sent via SMS. 

1. To enable the URL shortener for your Workspace, slide the **Enable URL Shortener** toggle on.
2. Select your URL shortener provider: Firebase or Branch.io. 
3. Enter the Web API Key, and enter the URL Prefix. 
3. Click **SAVE**. 

##  Mapping

In **Main Menu > Global Settings**, the Mapping tab allows you to choose and configure the mapping providers that will be used in your workspace. There are two dropdowns located in the Mapping tab: Mapping Providers and Basemaps. You will first need to fill out the Credentials for the rest of the dropdowns to appear.

### Mapping Providers 

In **Global Settings > Mapping**, click the **Mapping Providers** dropdown. Mapping Providers cannot be added or deleted, but you can edit their access keys and tokens and change their status to active or inactive. Filter the Mapping Providers list by status by clicking the **Filter** :material-filter: button. Search the list using keywords in the Search by name box.

To edit a Mapping Provider, click the **Quick Actions** :material-dots-vertical: button and then the **Edit** :material-pencil: button. Each provider will have a unique dialog. Make changes as needed and select **SAVE**.


!!! note "NOTE"

	For new installations, the following basemaps will have empty values and a status of Inactive until you edit each: Custom, Esri, Google, Web Map Service. OpenStreetMap will be enabled by default on fresh installs to ensure the system is functional with basemaps. Deactivate it if desired.

 


### Basemaps

In **Global Settings > Mapping**, click the **Basemaps** dropdown. Here you will see a list of your basemaps for all active providers. Search the basemaps list by name or provider. Export the list by clicking the **Export** :material-tray-arrow-down: button. Choose between CSV, Excel, or JSON format.

To edit any of your basemaps, select the basemap checkbox and click **Edit** :material-pencil:. 

You can edit the name or select the **Make this my default 2D basemap** or **Make this my default 3D basemap** checkbox. See Note below.

!!! note "NOTE"

	Only one basemap can be set as the default for 2D or 3D at a time. 3D maps are only available when Cesium is enabled. Contact Knowmadics for more information.

### Add Basemap
To add a new Basemap, click the **New Basemap** :material-pencil: button. Choose between a **Custom** or **Web Map Service** basemap. 

#### Web Map Service
If you choose Web Map Service as your mapping provider, use the following instructions to add basemaps.

1. In the Credentials tab, enter the URL for the Web Map Service.
2. Select the Authentication Type from the following options: None, API Key, Basic Authentication, and Token-based Authentication.
3. Select **Next** to proceed to the Basemaps tab. Make selection(s) from your available Basemaps, and click **Add Basemaps**.
4. To delete a Web Map Service basemap, click the **Quick Actions** :material-dots-vertical: button or select the checkbox next to the baseman. Click the **Delete** :material-trash: button. Confirm you want to delete the basemap(s).



#### Custom Basemap
If you choose to create a Custom basemap, use the following instructions.

1. Enter a name for the basemap.
2. Enter the direct URL to the tile service or mapping resource. Ensure the URL is correct and accessible for proper basemap rendering.
3. Click **Save** to add the basemap to the system.

!!! note "NOTE"

	The **Delete** option is only available for basemaps created by users or those added via Web Map Service (WMS).

##  Security
In **Main Menu > Global Settings**, in the Security tab, you will make elections on MFA Settings and Sign-in security. 

###  MFA Settings

In **Global Settings > Security**, MFA, or Multi-Factor Authentication, is a security system that requires more than one method of authentication from independent categories of credentials to verify the user’s identity at login.

In the **MFA Settings** dropdown, enable MFA by sliding the **Enable MFA (Multi-Factor Authentication)** toggle switch on. 

1. The Frequency field is defaulted to **Every sign on**. 
2. If the IP Address that is being used is a new one for the user, the field Additionally on Change of IP Address is defaulted to **Never**.  
3. Choose the Delivery Method from the dropdown; choose from **Email, SMS,** or **Both.**
4. If you have chosen **SMS** or **Both** for the step above, enter an SMS Message.
5. If you have chosen **Email** or **Both**, enter your Email Subject and Email Body in the designated fields.  
6. Click **SAVE**. 

###  Sign In

In **Global Settings > Security**, click the **Sign In** dropdown and make choices to set preferences for signing into your workspaces. Choices include the following.

| Setting | Purpose |
|:--|:--|
| Number of attempts before user account is locked |  Ability to choose to disable this feature or give user from 1-10 attempts (**Note**: Disabling this feature is not recommended).|
| Number of minutes before user account becomes unlocked automatically | Ability to choose a time increment between 5-30 minutes after which a locked account becomes unlocked. |
| Number of days before an account is locked for inactivity | Ability to choose between 30 to 365 days until lock-out. |
| Minimum number of characters for password | Ability to choose between 8 to 14 characters for password length |
| Number of days before a password expires | Ability to choose from **Never** to 180 days for expiry  |
| Number of unique passwords before reuse | Ability to choose from 1 to 24 unique passwords before a user can reuse a prior password |
| Minimum days for password age | Ability to restrict users from changing their passwords too often. Offers a choice between 0 to 15 days to wait before changing passwords  |
| Number of minutes before access token expires | This is a field in which the user must enter an expiry in minutes. The access token is granted by 360°'s authorization server and is usually a smaller amount of time to grant access to the client application. When an access token expires, the client application looks to the refresh token to grant an additional access token. The authorization server validates the refresh token and issues a new access token; the end user is not prompted to re-authenticate unless the refresh token has expired. |
| Number of hours before refresh token expires | This is a field in which the user must enter an expiry in hours. Decimals of hours are accepted (e.g., .25 hours represents 15 minutes). The refresh token is granted by 360°'s authorization server and is a longer amount of time to grant access to the client application. When an access token expires, the system looks to the refresh token to grant an additional access token. The authorization server validates the refresh token and issues a new access token; the end user is not prompted to re-authenticate unless the refresh token has expired.|


Toggle the **Display Logo** switch to show or remove your logo.

### Okta Settings 
In **Global Settings > Security > Okta Settings**, you can enable Okta sign-in at a global level. Okta is an identity and access management platform that allows users to log in to multiple applications and services with one set of credentials. 

Toggle the **Enable Okta** switch on to make it available to all of your workspaces. Click **SAVE**. Note that when the toggle is switched on or off, you will need to reset IIS in order for the change to take effect.

###  Options

In **Global Settings > Security**, click the **Options** dropdown. Slide the **Workspace Switcher** toggle on to enable, in all workspaces, the option to easily switch between all the workspaces to which your users have access. Click **SAVE**. 

!!! note "NOTE"

	An IIS reset is required after switching the toggle on.


###  Sign In Message

In **Global Settings > Security**, in the **Sign In Message dropdown**, slide the **Enable Sign in Message** toggle switch on to enable a Sign in Message (e.g., terms of service).

1. Once this option is toggled on, you have a choice in the frequency of the sign in message. Choose from **Once and on message change** or **Every sign in**. 
1. Choose the Locations in which the sign in message will be seen: **Workspaces Only** or **Portal and Workspaces**.
1. In the Message field, type your sign in message. 
2. Click **SAVE**. 

### reCAPTCHA

In **Global Settings > Security**, click the **reCAPTCHA** dropdown. reCAPTCHA protects the workspace by verifying users are humans, not bots. Enter your CAPTCHA Key in the labeled field, and then enter your Secret Key to enable reCAPTCHA. Click **SAVE**. 

## Trackers

In **Main Menu > Global Settings**, the Trackers tab will reveal all the trackers that are capable of being auto-added in your workspace. You can search the list by model or workspace. Filter the list by Status (Active, Inactive, or All) by clicking the **Filter** :material-filter-variant: button. Export the list by clicking the **Export** :material-tray-arrow-down: button. Choose between CSV, Excel, or JSON format.

### Edit Tracker

In **Global Settings > Trackers**, to edit any tracker, click the tracker row or click **Quick Actions** :material-dots-vertical:. 

1. If the tracker is inactive, the only option you will see is the **Auto Add** toggle switch. Toggle the switch on to make the tracker active and open more options. 
2. Once the toggle switch is on, you are able to edit the Workspace field, and a new toggle switch will appear: **Notify**. When **Notify** is turned on for Auto-Add, the owner of the workspace will be notified by email when devices of that model have been auto-added to the system. 
3. Click **SAVE** to preserve your changes. 

!!! note "NOTE"
		
	Once a device has been auto-added, it can be found in the associated workspace as an Unassigned device in **Main Menu > Manage > Devices**. From there, you can select the device and click the **Move Device** button to assign it to a subsite or project.

### Activate/Deactivate Tracker

In **Global Settings > Trackers**, activating a tracker controls whether it is shown in the workspace in the New Tracker dialog in **Main Menu > Manage > Devices > New Device > Tracker**. 

1. To activate a tracker, select the **Quick Actions**:material-dots-vertical: button at the end of any inactive tracker row. Click **Activate** :material-toggle-switch:.
2. To deactivate a tracker, select the **Quick Actions**:material-dots-vertical: button at the end of any active tracker row. Click **Deactivate** :material-toggle-switch:

##   Overview Screen

In **Main Menu > Overview**, the **Overview** :material-home-variant: screen acts as the home screen for the Portal workspace. The Overview screen contains the following tabs and cards of information: Workspaces :material-domain:, Portal Users :material-shield-check:, Emails :material-email:, SMS :material-message-processing:, Live Links :material-link:, Devices/Map Elements bar chart (which can be switched to a line graph view), Statistics (for All Workspaces), and four charts (which can be switched between pie and doughnut chart views), including Access, Devices, Social, and Map Elements. 

###   Workspaces

In **Main Menu > Overview**, click on the **Workspaces** :material-domain: tab for another way, along with the **Main Menu** sidebar, of accessing the **Workspaces** screen. This tab also lists the number of workspaces within your system. 

###   Portal Users 

In **Main Menu > Overview**, click on the **Portal Users** :material-shield-check: tab for another way, along with the main menu, of accessing the **Portal Users** screen. This tab also lists the number of portal users within your system. 

###  Emails

In **Main Menu > Overview**, the **Emails** :material-email: card will tell you how many welcome/invite emails have been sent out, across all of your workspaces. The number shown is for the current month only. 

###  SMS

In **Main Menu > Overview**, the **SMS** :material-message-processing: card will tell you how many SMS messages have been sent out to devices across all of your workspaces, inviting them to download the mobile app(s). The number shown is for the current month only. 

###   Live Links

In **Main Menu > Overview**, the **Live Links** :material-link: card will tell you how many Live Links have been generated for the current month, across all of your workspaces. 

###   Devices / Map Elements

In **Main Menu > Overview**, the **Devices** chart card shows a bar chart of all devices that have been added across your workspaces. 

1. Devices include Cameras, GPS Trackers, and Smartphones. 
2. The bar chart can be changed to a line graph view by clicking the **More** **Actions** :material-dots-vertical: button and then selecting **Line Chart**. 
3. Hovering over any of the bars/lines in the charts will give you the exact number for that device. 

You can change the Devices card to Map Elements by clicking the dropdown arrow beside the title. The **Map Elements** chart card shows a bar chart of all map elements that have been added across your workspaces in the last six months. 

1. Map elements include Points of Interest (POIs), Routes, and Geofences. 
2. To go back further than the last six months, click and drag the months at the bottom of the chart until new months are shown.
3. The bar chart can be changed to a line graph by clicking the **More Actions** :material-dots-vertical: button and then selecting **Line Chart**. 
4. Hovering over any of the bars/lines in the charts will give you the exact number for that map element.

!!! note "NOTE"

	To see months prior to the ones that are shown for both the **Devices** and **Map Elements** card, click anywhere on the chart and drag to the right. Prior months will scroll into view.

###   Statistics (All Workspaces)

In **Main Menu > Overview**, the **Statistics** card will list the amount of the Devices (broken down by device types), Map Elements (broken down by map element types), Sites, Subsites, Projects, Teams, and Users across all of your workspaces. 

###   Access

In **Main Menu > Overview**, the **Access** card is a pie chart of all your Teams, Projects, Sites, and Subsites. Click the **More Actions**:material-dots-vertical: button to see the option to switch to a doughnut chart. Hover over a color on the chart to see the exact number for that portion.  

###   Devices

In **Main Menu > Overview**, the **Devices** card is a doughnut chart of all your Cameras, Smartphones, and GPS Trackers. Click the **More Actions**:material-dots-vertical: button to see the option to switch to a pie chart. Hover over a color on the chart to see the exact number for that portion.   

###   Social

In **Main Menu > Overview**, the **Social** card is a pie chart of all your Emails, SMSs, and Live Links. Click the **More Actions**:material-dots-vertical: button to see the option to switch to a doughnut chart. Hover over a color on the chart to see the exact number for that portion.   

###   Map Elements

In **Main Menu > Overview**, the **Map Elements** card is a doughnut chart of all Geofences, Routes, and POIs. Click the **More Actions**:material-dots-vertical: button to see the option to switch to a pie chart. Hover over a color on the chart to see the exact number for that portion. 

##  Workspaces 

In the Administration section of the **Main Menu**, click **Workspaces** to open the Workspaces screen. This screen contains a table view of all your workspaces. In the secondary toolbar, you can find the search field and action buttons.

###  Create Workspace

In **Main Menu > Workspaces**, you can create a new workspace.

1. To create a Workspace, click the **Create** **Workspace** :material-pencil: button in the secondary toolbar. 
2. Enter the Name for the workspace. 
3. Next, choose an Application by clicking the dropdown arrow. Your available options will appear for you to choose. 
4. A Description is optional.
5. Choose a custom Subdomain (up to 63 letters, digits, and hyphens but no spaces).
5. Next, toggle the **Active Directory User** switch on if you are using Active Directory.  If you switch it on, you will need to enter your Active Directory Username. 
6. Enter a Workspace Admin Full Name, a Workspace Admin Email, and an optional Workspace Admin phone. 
7. Check the **Send invitation email** box if you’d like to send the invitation at this time. 
8. Click **CREATE** to close the dialog. 

###   Workspaces List

In **Main Menu > Workspaces**, now that you’ve created your workspaces, you will see them in the list. Click on any of the column headers to reorder the list. 

1. Search for any workspace by typing the Workspace name, Workspace Admin’s name, or Workspace Admin’s email in the Search field. 
2. To narrow the table, you can filter it by clicking the **Filter** :material-filter-variant: button in the secondary toolbar. The filters panel will slide out from the right. 
3. Select a checkbox beside a Workspace to open the option to **Deactivate** :material-toggle-switch-off: the Workspace.
4. Click a Workspace row to open that workspace’s detail screen, which includes three tabs: Overview, Security Policy, and Branding.

!!! note "NOTE"

	Deactivating a Workspace will not delete the Workspace.

###  Workspace Overview

In **Main Menu > Workspaces**, select any workspace to see its Overview screen. The Workspace Overview screen is similar to the main Overview screen. At the top of the screen, there is an overview card that holds the workspace’s name and status. There are fields that you can change, including the Name, Description, Workspace Admin Full Name, and Workspace and Admin Phone. There are two fields that you _cannot_ change: Subdomain and Workspace URL. 

#### Invite Workspace Admin

In **Main Menu > Workspaces**, in a Workspace Overview screen, you can invite a new Workspace Admin.

1. In Workspaces, select a workspace.
2. In the Overview tab, click the **Invite Workspace Admin** :material-pencil: button at the top right of screen.
3. Fill out the required fields and select the **Send invitation email** checkbox.
4. Click **CREATE**.  

#### Deactivate Workspace

In **Main Menu > Workspaces**, in a Workspace Overview screen, you deactivate a workspace if needed.

1. In Workspaces, select a workspace.
2. In the Overview tab, click the **More Actions**:material-dots-vertical: button at the top right of screen.
3. Slide the **Inactivate** toggle. Reverse the instructions to Activate.

#### Emails

In **Main Menu > Workspaces**, in a Workspace Overview screen, the **Emails** information card will tell you how many welcome/invite emails have been sent out by this workspace. The number shown is for the current month only. 

#### SMS

In **Main Menu > Workspaces**, in a Workspace Overview screen, the **SMS** card will tell you how many SMS messages have been sent out to devices from this workspace. The number shown is for the current month only. 

#### Live Links

In **Main Menu > Workspaces**, in a Workspace Overview screen, the **Live Links** card will tell you how many Live Links have been generated for the current month and for this workspace. 

#### Devices / Map Elements

In **Main Menu > Workspaces**, in a Workspace Overview screen, the **Devices** card shows a bar chart of all devices that have been added to this workspace. Devices include Cameras, GPS Trackers, and Smartphones. 

1. The bar chart can be changed to a line graph view by clicking the **More Actions**:material-dots-vertical: button, then select **Line Chart**. 
2. Hover over any of the bars/lines in the charts to see the exact number for that device type. 

You can change the **Devices** card to **Map Elements** by clicking the dropdown arrow beside the title. The **Map Elements** card shows a bar chart of all map elements that have been added across your workspaces in the last six months. Map elements include Points of Interest (POIs), Routes, and Geofences.

2. The bar chart can be changed to a line graph view by clicking the **More Actions**:material-dots-vertical: button, then select **Line Chart**. 
3. Hover over any of the bars/lines in the charts to see the exact number for that map element.

!!! note "NOTE"

	To see months prior to the ones that are shown, click anywhere on the chart and drag to the right. Prior months will scroll into view. 

#### Statistics

In **Main Menu > Workspaces**, in a Workspace Overview screen, the **Statistics** card will list all the Devices, Map Elements, Sites, Subsites, teams, Projects, and Users in this workspace. 

###  Workspace Configuration

In **Main Menu > Workspaces**, in the **Configuration** tab, you can make various configuration choices for each workspace by clicking the following dropdown panels.

#### Branding

In **Main Menu > Workspaces > Configuration**, click the **Branding** dropdown to customize the look of your workspace. You can upload variations of your chosen logo, including a Light Mode Logo, Dark Mode Logo, Splash Screen Logo, and Favicon. 

1. Under Product Information, choose a Customer Name and Product Name. 
3. Upload your own Light Mode Logo by clicking **CHOOSE LOGO**. Choose the Light Mode Logo that you wish to upload by double-clicking it from your computer files. 
4. Upload your own Dark Mode Logo by clicking **CHOOSE LOGO**. Choose the Dark Mode Logo that you wish to upload by double-clicking it from your computer files. 
5. Upload your own Splash Screen Logo by clicking **CHOOSE LOGO**. Choose the Splash Screen Logo that you wish to upload by double-clicking it from your computer files.
5. Upload your own Favicon by clicking **CHOOSE FAVICON**. Choose the Favicon that you wish to upload by double-clicking it from your computer files. 
6. To remove any of your uploads and return to the system default, click **REMOVE**. 


#### Chat

In **Main Menu > Workspaces > Configuration**, click the **Chat** dropdown. Slide the toggles on to **Enable IP chat for user messaging** and/or to **Enable SMS for device messaging** and click **SAVE**. 

#### Create Account

In **Main Menu > Workspaces > Configuration**, click the **Create Account** dropdown. To allow users to create their own accounts from the sign-in page, toggle the **Create Account** switch on. Make sure to click **SAVE** to preserve your choice. 

!!! note "NOTE"

	This setting is only available for 360° Logistics workspaces.


#### Sharing

In **Main Menu > Workspaces > Configuration**, click the **Sharing** dropdown. To allow your workspace to share device and map element data amongst other workspaces, subsites, and projects (shared with viewer only permissions), toggle the **Enable** **Device & Map Element Sharing** switch on. Make sure to click **SAVE** to preserve your choice. 

!!! note "NOTE"

	This setting is only available for 360° Plus workspaces.

#### Mobile Apps

In **Main Menu > Workspaces > Configuration**, click the **Mobile Apps** dropdown. The Mobile Apps screen lists all the app variants available to you, dependent on workspace type. Beside each app name there is a toggle. Slide the toggle to enable this mobile app in the workspace. Click **SAVE**

#### Workspace Add-ons

In **Main Menu > Workspaces > Configuration**, click the **Workspace Add-ons** dropdown. In 360° Logistics workspaces, if you would like to enable **Aviation Transport**, **Camp Management**, **Cargo Transport**, and/or **Ground Transport** (e.g., Training, Documents, User Request Templates, etc. ) for this workspace, slide these toggles on and click **SAVE**. 

For 360° Workspaces, to enable **Cesium 3D Maps**, slide this toggle on. 


#### Motorola IMW Radios

In **Main Menu > Workspaces > Configuration**, click the **Motorola IMW Radios** dropdown. Motorola IMW Radios provide secure communication for mission-critical operations. If this workspace will be using Motorola IMW Radios, slide the toggle on and click **SAVE**. This will enable users to configure the Motorola settings in **Main Menu > Settings > Third Party Integrations > Motorola IMW Radios** in their workspace.

#### Mobile Maps

In **Main Menu > Workspaces > Configuration**, click the **Mobile Maps** dropdown. This setting allows users to access map data without internet connection. If you'd like to use offline maps for this workspace, toggle on the **Enable Offline Maps** switch on. Choose your Min Zoom (0-21) and Max Zoom levels 1-22). Note that your Max Zoom needs to be greater than your Min Zoom. Select **SAVE**. 

!!! note "NOTE"

	This setting is only available for 360° Plus workspaces.

#### NENA PSAP
In **Main Menu > Workspaces > Configuration**, click the **NENA PSAP** dropdown. NENA PSAP (National Emergency Number Association Public Safety Answering Point) enables efficient emergency call handling and response/support coordination. If you’d like to utilize NENA PSAP services for this workspace, slide the **Enable NENA PSAP** toggle on and click **SAVE**. 

#### Sensor Kits

In **Main Menu > Workspaces > Configuration**, click the **Sensor Kits** dropdown. Sensor kits enable data collection for environmental monitoring and asset tracking. If the workspace will be using Panther 4 sensor kits, slide the **Panther 4** toggle on and click **SAVE**. 

!!! note "NOTE"

	This setting is only available for 360° Plus workspaces.

#### Simulator

In **Main Menu > Workspaces > Configuration**, click the **Simulator** dropdown. To enable a simulator for the workspace, slide the **Enable Simulator** switch on and click **SAVE**. 

!!! note "NOTE"

	This setting is only available for 360° Plus workspaces.


#### SMS Commands

In **Main Menu > Workspaces > Configuration**, click the **SMS Commands** dropdown. To see the SMS commands option for your workspace, you also must have a Twilio account enabled. Twilio enables communication through SMS, voice, and email integration. Slide the **Device SMS Commands** toggle on and click **SAVE**.  

SMS Commands will show up in the **Manage > Devices > Device Details > Controller/Log** screen in the workspace. 

!!! note "NOTE"

	This setting is only available for 360° Plus workspaces.


#### Targets

In **Main Menu > Workspaces > Configuration**, click the **Targets** dropdown. If your workspace will need to enable Targets, which can then be configured in **Main Menu > Settings** and **Main Menu > Projects** in the workspace, switch the **Enable Targets** switch on. You also have the option of customizing the Create Target dialog found in **Main Menu > Projects > Targets**. 

2. Choose a name other than Target Name, e.g., Target ID, if desired. 
3. The **Display Device SCRIMM for GPS Trackers** switch is defaulted to on and will only be displayed if targets are enabled. 
4. If you do not want to display the SCRIMM panel in the Device Overview screen in your workspace, switch the toggle off.  
4. Click **SAVE**.

!!! note "NOTE"

	This setting is only available for 360° Plus workspaces.


#### Warrants

In **Main Menu > Workspaces > Configuration**, click the **Warrants** drop down. If your workspace will need to access the Warrants feature, then you will need to enable Warrants. Simply toggle the **Enable Warrants** switch on.  

!!! note "NOTE"

	This setting is only available for 360° Plus workspaces.

### Workspace Security

In **Main Menu > Workspaces**, in the **Security** tab, you will find the following dropdown settings: Identity Management, MFA Settings, Sign In Message, and Keep Me Signed In Setting. 

#### Identity Management
In **Main Menu > Workspaces > Security > Identity Management**, you can control whether Azure Active Directory or Okta is used for sign-in and manage the settings for either. This will enable users to access multiple applications with a single set of credentials. Select **None** to use neither. See below for instructions for these settings. 

#### Azure Active Directory 

In **Main Menu > Workspaces > Security**, click the **Identity Management** dropdown. 

1. If this workspace will be using single sign-on (SSO) via Azure Active Directory, select **Azure Active Directory** from the dropdown. 
1. Add the domain name in the Add Domain field. 
1. If you want users in this workspace to be able to create a username and password for times when SSO is not available, toggle the **Authenticate with Username & Password** on to require username and password.. 
2. Click **SAVE**. 

#### Okta 

In **Main Menu > Workspaces > Security**, click the **Identity Management** dropdown. 

1. If this workspace will be using single sign-on (SSO) via Okta, select **Okta** from the dropdown. 
2. If you want users in this workspace to be able to create a username and password for times when SSO is not available, toggle the **Authenticate with Username & Password** on to require username and password. 
3. Click **SAVE**.

#### MFA Settings

In **Main Menu > Workspaces > Security**, click the **MFA Settings** dropdown. MFA, or Multi-Factor Authentication, is a security system that requires more than one method of authentication from independent categories of credentials to verify the user’s identity at login. 

Toggle **Enable MFA (Multi-Factor) Authentication** switch on to enable MFA. Click **SAVE**. 

#### Sign In Message

In **Main Menu > Workspaces > Security**, click the **Sign In Message** dropdown to enable a sign in message for this workspace (e.g., terms of service). 

1. Toggle the **Enable Sign in Message** switch on. 
2. Once this option is toggled on, you have a choice in the frequency of the sign in message. Choose from **Once and on message change** or **Every sign in**. 
1. In the Message field, type your sign in message. 

#### Keep Me Signed In Setting

In **Main Menu > Workspaces > Security**, click the **Keep Me Signed in Setting** dropdown. Toggle the **Enable Keep Me Signed In** switch on to enable this setting for all users in this workspace. 

When on, the user will see a **Keep Me Signed In** checkbox on the login screen to their workspace. The box will then be checked by default, and the user will be automatically signed in whenever they access their workspace URL (for the next 365 days).

## Portal Users

In the Administration section of the **Main Menu**, click **Portal Users** :material-shield-check:. You can also access this screen through the **Portal Users** tab on the Overview screen. The **Portal Users** screen contains a table view of all the portal users. In the secondary toolbar you can find the search field and action buttons.

### Create Portal User

In **Main Menu > Portal Users**, you can create a new portal user. Click the **Create User** :material-pencil: button in the secondary toolbar of the **Portal Users** screen.

2. If you are using Active Directory, toggle the **Active Directory User** switch on. If on, you will need to enter the Username. 
3. Next, enter the Full Name of the user, the Email, optional Phone number.
4. Click the dropdown arrow in the Role field. There are two Roles to choose from: System Admin and System Viewer.
4. The **Send invitation email** box will be checked by default. Uncheck if you do not wish to the send the email.
5. Click **CREATE** to finish the process. 

!!! note "NOTE"

	The System Viewer role will have read-only privileges.

### Portal Users Table

In **Main Menu > Portal Users**, now that you’ve created your portal users, you will see them in the **Portal Users Table** table. Clicking on any of the column headers will reorder the table.
 
2. Search for any user by typing their name, username, email, or role in the Search field. 
3. To narrow the table, you can filter it by clicking the **Filter**:material-filter-variant: button in the secondary toolbar, and the filters panel will slide out from the right. 
4. Selecting a checkbox beside a portal user will open more actions in the secondary toolbar, including **Resend** **Invite** :material-send: and **Deactivate** :material-toggle-switch-off:. You may perform these actions with two or more users by checking multiple boxes. 

### Portal User Profile

In **Main Menu > Portal Users**, if you click on the name of any portal user, you will see their Portal User Profile. The Portal User Profile looks just like your own profile, which you can access via the **Account Menu**. 

The Portal User Profile contains two information cards: User Profile and Region.  

1. In User Profile, you can edit the user’s Full Name, Phone, and Role (System Admin or System Viewer). Click **SAVE** after you make the changes. You cannot edit the user’s User Name or Email.
2. In the Region card, the user’s time zone is automatically set unless you toggle off the **Set time zone automatically** switch. If you toggle it off, another toggle switch will appear: **Adjust for Daylight Savings automatically**. 
3. In the Language dropdown, choose your preferred language from the choices. 

## Services

In the Tools portion of the **Main Menu**, the **Services** screen is where you can view a list of computer names (or IP address if no name is available) and the status of the services enlisted on each. Sort any of the columns by clicking on the header. If the status is Offline, select the **Quick Actions**:material-dots-vertical: button and click **Restart Services**. 

## System Notifications

In the Tools portion of the **Main Menu**, choose :material-bell: **System Notifications**. This is where you can send e-mailed messages (i.e. notifications of scheduled events) to active Workspace Admins and/or all users in your workspace.  

Refer to the table below to see available actions in the System Notifications screen. 

| Icon | Name | Action |
| -----|------- | ------- |
:material-pencil: | Create New System Notification | Opens a dialog of required fields, including Delivery (choose date and time), Recipients, Subject, and E-mail Content. 
:material-tray-arrow-down: | Export Options | Exports the list in CSV or Excel format. 
:material-filter-variant: | Filter | Opens filter options for the list, including Delivery (date) and Status (All, Scheduled, or Completed).
:material-delete: | Bulk Delete | Deletes multiple notifications when more than one checkbox is selected. 
:material-dots-vertical: | Quick Actions | Offers three additional options at the end of each notification row: Edit, Delete, and Copy. Copying a notification copies all content except the Delivery date/time.


!!! note "NOTE"

	You can also edit any scheduled notification by clicking it. The Edit Systems Notification dialog will open. Make your changes and select **‌SAVE**.

## Rules
In the Tools portion of the **Main Menu**, select :material-list-status: **Rules**. Here you can set up a list of recipients to receive an email notification when a failed Active Directory (AD) sync item is detected or when a new manufacturer, device model, or tracker model is identified.

Search and add users in the AD Sync Failures field to notify users for failed AD sync items. Click **SAVE** after you make your changes.

Search and add users in the Smartphones or Smartwatches fields to notify users when a new manufacturer or device model is detected. Search and add users in the Trackers field to notify users when a new tracker model is detected. Click **SAVE** after you make your changes.

##  Audit Reports 

In the Reports & Analytics portion of the **Main Menu**, choose :material-clipboard-check: **Audit Reports** to open the Audit Reports screen. This screen contains tabs of the different audit events, including Login, Record Management, All Events, and Access Control. 

1. The secondary toolbar is where you can find the search field and action buttons. Below, there is a list view of the different events.
2. The Search field allows you to search by User Name, Event Name, and IP Address. 
3. The secondary toolbar also has action buttons, including **Export Options** :material-swap-vertical:, which allows you to choose a file format and download any event report to your computer. File formats include CSV and Excel. 
4. You can also filter the list using the **Filter** :material-filter-variant: button. The filters panel will slide out from the right. Filters include Date Created, Event Types, and Entity Types. Event Types and Entity Types will vary by report and are detailed in the following sections.
5. Click the titles in any of the columns to sort the columns numerically, contextually, or alphabetically, depending on the content. 

### Login 

In **Main Menu** > **Audit Reports**, the Login reports allow portal users to review past user login events. When you select the Login tab, entries for any login event on the current day only will appear in the table. 

To see specific events and dates, click the **Filter** :material-filter-variant: button. 

### Record Management 

In **Main Menu** > **Audit Reports**, the Record Management report allows portal users to review past user “create, read, update, and delete” (CRUD) events. When you select the Record Management tab, entries for any CRUD event on the current day only will appear in the table. 

To see specific events and dates, select the **Filter** :material-filter-variant: button. 

### All Events

In **Main Menu** > **Audit Reports**, the All Events report allows portal users to view all user events. When you select the All Events tab, entries for all events on the current day only will appear in the table.

To see specific events and dates, select the **Filter** :material-filter-variant: button.

### Access Control

In **Main Menu** > **Audit Reports**, the Access Control report allows portal users to review past access control events, e.g., when a portal user changes another user’s access rights. When you select the Access Control tab, entries for all access control events on the current day only will appear in the table.

To see specific events and dates, select the **Filter** :material-filter-variant: button. 

## Reports

In the Reports & Analytics portion of the **Main Menu**, choose :material-chart-line-variant: **Reports** to open the Reports screen. This screen contains tabs of the different Reports.

### Device Details
In **Main Menu** > **Reports** the Device Details report displays all of the devices across all of the workspaces in the portal. Large filters at the top of the screen will filter the devices by type. Columns in the report reveal specific information about each device, including the associated Workspace, the device Status, Model, Serial number, Version, date Created, and much more. Additional filters like Date Created and Device Type can be found by selecting the **Filter** :material-filter-variant: button in the toolbar. 

Export the report by selecting the **Export** :material-tray-arrow: button. 

### Email Details
In **Main Menu** > **Reports**, the Email Details report displays data about emails that were sent and received in each workspace. Large filters at the top of the screen will filter the emails by **Incoming, Outgoing**, or **All**. Filter by **Day, Week, Month**, or a particular date by selecting the respective filters. In addition, you can filter by selecting the **Filter** :material-filter-variant: button in the toolbar. Choose from Direction or Processed (e.g., if the email was transmitted or interrupted). 

Export the report by selecting the **Export** :material-tray-arrow: button. 



### SMS Details

In **Main Menu** > **Reports**, the SMS Details report displays data about SMS messages that were sent and received in each workspace. Large filters at the top of the screen will filter the SMSs by **Incoming, Outgoing**, or **All**. Filter by **Day, Week, Month**, or a particular date by selecting the respective filters. In addition, you can filter by selecting the **Filter** :material-filter-variant: button in the toolbar. Choose from Direction or Processed (e.g., if the SMS was transmitted or interrupted). 

Export the report by selecting the **Export** :material-tray-arrow: button. 


### Error Log

In **Main Menu > Reports**, select the **Error Log** tab to open the **Error Log Report**. The Error Log report displays consolidated error logs to help troubleshoot and learn the source of errors. 

1. Filter the report by **Day, Week, Month**, or a particular calendar date by selecting the respective filters. In addition, you can filter by selecting the **Filter**:material-filter-variant: button in the toolbar. Filter by Group ID, Computer Name, or Source of the error. 
2. Pause the error log from displaying new errors by selecting the **Pause** button. 
3. Open any single error record by selecting its row from the list. Export the single record from the dialog, if  necessary. You can also export the entire list from the toolbar by selecting the **Export** :material-tray-arrow: button. . 

### Redis Log

The Redis log report provides quality of service monitoring, recording the server’s runtime activity, warnings, errors, and performance events. These logs are crucial for monitoring, debugging, and auditing Redis operations.

In **Main Menu > Reports**, select the **Redis Log** tab to open the Redis Log Report. The Redis Log report displays consolidated error logs to help troubleshoot and learn the source of errors. 

1. Filter the report by **Day, Week, Month**, or a particular calendar date by selecting the respective filters. In addition, you can filter by selecting the **Filter** :material-filter-variant: button in the toolbar. Filter by Server Endpoint.
2. Export the report by selecting the **Export** :material-tray-arrow: button. 
