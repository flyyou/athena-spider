/*
 * File: app/controller/DashboardController.js
 *
 * This file was generated by Sencha Architect version 3.0.4.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('spider.controller.DashboardController', {
    extend: 'Ext.app.Controller',

    init: function(application) {
        var dashBoard = this;

        //Dashboard Menu Constants
        Ext.define('dashboardConstants', {
            singleton: true,
            me : dashBoard
        });
    },

    renderDashboard: function() {

        var dashboardPanel = Ext.getCmp("DashboardPanel");

        dashboardPanel.setLoading(true);

        Ext.getCmp("DashBoardLeftPanel").removeAll();
        Ext.getCmp("DashBoardRightPanel").removeAll();

        Ext.each(Ext.getCmp("listMenuPanel").store.getRootNode().childNodes, function(record, idx){

            var nodePanel = Ext.getCmp("DashBoardNodePanel").cloneConfig({itemId : "DashBoardNodePanel"+idx});

            nodePanel.down('#VmHostStat').setText('<center><img src="resources/images/icons/status_03.png" width="36" height="36" border="0"></center>', false);
            nodePanel.down('#VmHostName').setText(record.get('text'));

            nodePanel.down('#cpuBar');
            nodePanel.down('#memoryBar');
            nodePanel.down('#diskBar');
            /*
            Ext.getCmp('cpuBar').updateProgress(data.usage.cpu.percentage / 100, data.usage.cpu.percentage + "%");

            var children = nodePanel.down('#vmNamePanel').items.items;
            Ext.each(children, function (child, idx) {
                if(idx > 0)
                    child.setText("");
            });

            nodePanel.down('#vmCpuPanel');
            nodePanel.down('#vmMemPanel');
            nodePanel.down('#vmNetPanel');
            */

            if(idx%2 === 0) {
                Ext.getCmp("DashBoardLeftPanel").add(nodePanel);
            } else {
                Ext.getCmp("DashBoardRightPanel").add(nodePanel);
            }

            nodePanel.show();
            nodePanel.body.on('click', function(e) {
                vmHostConstants.me.popVMHostInfoWindow(record);
            });

        });

        dashboardPanel.setLoading(false);

    }

});
