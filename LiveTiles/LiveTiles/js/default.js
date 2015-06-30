// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    // first of all, add WinJS if not defined
    if (typeof WinJS === "undefined")
    {
        // Adding the script tag
        var winJSScript = document.createElement("script");
        winJSScript.type = "application/javascript";
        winJSScript.src = "ms-appx-web:///WinJS/js/WinJS.js";
     
        document.head.appendChild(winJSScript);
 
        winJSScript.onload = winJSLoaded;
    }
    else
    {
        winJSLoaded();
    }
 
    // JS function executed when WinJS has been loaded by app
    function winJSLoaded() {
        var app = WinJS.Application;
        var activation = Windows.ApplicationModel.Activation;

        app.onactivated = function (args) {
            if (args.detail.kind === activation.ActivationKind.launch) {
                if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                    // TODO: This application has been newly launched. Initialize your application here.
                } else {
                    // TODO: This application has been reactivated from suspension.
                    // Restore application state here.
                }
                args.setPromise(WinJS.UI.processAll());

                registerTask();
            }
        };

        app.oncheckpoint = function (args) {
            // TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
            // You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
            // If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
        };

        app.start();

        // set the default application tile
        setTile("New Tile", 10);

        // register the background task and also set the handler for task complete
        function registerTask() {
            var taskRegistered = false;
            var exampleTaskName = "backgroundTask";

            var background = Windows.ApplicationModel.Background;
            var iter = background.BackgroundTaskRegistration.allTasks.first();

            while (iter.hasCurrent) {

                var task = iter.current.value;

                if (task.name === exampleTaskName) {

                    taskRegistered = true;
                    break;
                }

                iter.moveNext();
            }

            // only if task is not registered, register it and also set the backgroundTaskComplete code.
            if (taskRegistered != true) {
                var builder = new Windows.ApplicationModel.Background.BackgroundTaskBuilder();
                var trigger = new Windows.ApplicationModel.Background.TimeTrigger(15, true);

                builder.name = exampleTaskName;
                builder.taskEntryPoint = "js\\backgroundTask.js";
                builder.setTrigger(trigger);

                builder.addCondition(new Windows.ApplicationModel.Background.SystemCondition(Windows.ApplicationModel.Background.SystemConditionType.internetAvailable));
                var task = builder.register();
            }
            
            // set on Runtime the completed event
            task.addEventListener("completed", backgroundTaskCompleted);
        }

        // Changes the tile after execution of background task
        function backgroundTaskCompleted(args) {
            try {
                var currentDate = new Date()

                setTile("Tile from Background task", currentDate.getMinutes());
            } catch (ex) {
                // handle the error properly
            }
        }

        // Set the application tile and badge
        function setTile(tileText, badgeValue) {

            var notifications = Windows.UI.Notifications;

            // Build Badge
            var type = notifications.BadgeTemplateType.badgeNumber;
            var xml = notifications.BadgeUpdateManager.getTemplateContent(type);

            // update element
            var elements = xml.getElementsByTagName("badge");

            var element = elements[0];
            element.setAttribute("value", badgeValue);

            // Create badge
            var updator = notifications.BadgeNotification(xml);
            notifications.BadgeUpdateManager.createBadgeUpdaterForApplication().update(updator);

            // Create Tile template
            var template = notifications.TileTemplateType.tileSquare150x150PeekImageAndText01;
            var tileXml = notifications.TileUpdateManager.getTemplateContent(template);

            var tileTextAttributes = tileXml.getElementsByTagName("text");
            tileTextAttributes[0].appendChild(tileXml.createTextNode(tileText));

            var tileImageAttributes = tileXml.getElementsByTagName("image");
            tileImageAttributes[0].setAttribute("src", "ms-appx:///images/tileImage.png");
            tileImageAttributes[0].setAttribute("alt", "red graphic");

            // update the application tile
            var tileNotification = new notifications.TileNotification(tileXml);
            notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
        }
    }
})();
