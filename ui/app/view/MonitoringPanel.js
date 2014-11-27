/*
 * File: app/view/MonitoringPanel.js
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

Ext.define('spider.view.MonitoringPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.monitoringpanel',

    requires: [
        'Ext.tree.Panel',
        'Ext.tree.View',
        'Ext.tree.Column',
        'Ext.Img'
    ],

    id: 'MonitoringPanel',
    itemId: 'MonitoringPanel',
    layout: 'border',
    bodyStyle: 'background:#ffffff',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'treepanel',
                    region: 'west',
                    frame: true,
                    id: 'listMonitoringCheckMenuPanel',
                    itemId: 'listMonitoringCheckMenuPanel',
                    margin: 10,
                    padding: 0,
                    width: 200,
                    overflowY: 'auto',
                    frameHeader: false,
                    title: 'Check VM List',
                    hideHeaders: true,
                    rootVisible: false,
                    viewConfig: {
                        frame: true
                    },
                    columns: [
                        {
                            xtype: 'treecolumn',
                            dataIndex: 'text',
                            text: 'Nodes',
                            flex: 1
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    region: 'center',
                    overflowY: 'auto',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'panel',
                            frame: true,
                            height: 540,
                            id: 'monitoringCpuChart',
                            margin: '10 20 10 10',
                            width: 700,
                            title: 'CPU Chart',
                            listeners: {
                                resize: {
                                    fn: me.onMonitoringCpuChartResize,
                                    scope: me
                                }
                            },
                            items: [
                                {
                                    xtype: 'image',
                                    height: 201,
                                    width: 201,
                                    src: '/'
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            frame: true,
                            height: 540,
                            id: 'monitoringMemoryChart',
                            margin: '10 20 10 10',
                            width: 700,
                            title: 'Memory Chart',
                            items: [
                                {
                                    xtype: 'image',
                                    height: 201,
                                    width: 201,
                                    src: '/'
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            frame: true,
                            height: 540,
                            id: 'monitoringNetworkChart',
                            margin: '10 20 10 10',
                            width: 700,
                            title: 'Network Chart',
                            items: [
                                {
                                    xtype: 'image',
                                    height: 201,
                                    width: 201,
                                    src: '/'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    },

    onMonitoringCpuChartResize: function(component, width, height, oldWidth, oldHeight, eOpts) {
        clearInterval(monitoringConstants.chartInterval);
        monitoringConstants.me.showMonitoringImg(width, height);

        monitoringConstants.chartInterval = setInterval(function() {

            monitoringConstants.me.showMonitoringImg();

        }, 5000);

    }

});