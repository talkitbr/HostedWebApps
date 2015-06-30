//
// A JavaScript background task is specified in a .js file. The name of the file is used to
// launch the background task.
//
(function () {
    "use strict";

    //
    // This var is used to get information about the current instance of the background task.
    //
    var backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;


    //
    // This function will do the work of your background task.
    //
    function doWork() {
        var key = null,
            localSettings = Windows.Storage.ApplicationData.current.localSettings;

        // Write JavaScript code here to do work in the background.


        //
        // Record information in LocalSettings to communicate with the app.
        //
        key = backgroundTaskInstance.task.taskId.toString();
        localSettings.values[key] = "Succeeded";

        showToast("Hello Toast!");

        close();
    }

    doWork();

    function showToast(toastText) {
        var notifications = Windows.UI.Notifications;
        var template = notifications.ToastTemplateType.toastText01;
        var toastXml = notifications.ToastNotificationManager.getTemplateContent(toastXml);
        var toastTextElements = toastXml.getElementsByTagName("text");
        toastTextElements[0].appendChild(toastXml.createTextNode(toastText));
        var toast = new notifications.ToastNotification(toastXml);
        var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toast);
    }

})();
