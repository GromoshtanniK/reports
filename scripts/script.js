/**
 * Created by Vladislav on 07.11.2015.
 */

$(document).ready(function() {

    String.prototype.format = String.prototype.format = function () {
        var args = arguments;
        return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
            if (m == "{{") { return "{"; }
            if (m == "}}") { return "}"; }
            return args[n];
        });
    };

    Date.prototype.monthDays= function(){
        var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
        return d.getDate();
    };

    Date.prototype.getNormalizedMonth= function(){
        var month = (this.getMonth() + 1).toString();
        if(month.length === 1) {
            month = "0" + month;
        }
        return month;
    };



    var tabTemplate = '<li><a data-toggle="tab" href="#{0}">{1}<button class="close closeTab" type="button" >×</button></a></li>';
    var tabContentTemplate = '<div id="{0}" class="tab-pane fade">{1}</div>';
    var paginationTemplate = '<p class="pagination"></p>';
    var topDatePickerMenuTemplate =
        '<div class="parameters">' +
        '<div class="form-inline">' +
        '<span>Отчетный период с</span>' +
        '<div class="input-group date dateInput startPeriod">' +
        '<input class="form-control" size="16" type="text" readonly>' +
        '<span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>' +
        '</div> ' +
        '<span>по</span> ' +
        '<div class="input-group date dateInput endPeriod">' +
        '<input class="form-control" size="16" type="text" readonly>' +
        '<span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>' +
        '</div>' +
        '<button class="btn apply" type="button">Применить</button>' +
        '</div>' +
        '</div>' + '<div class="tabTable"></div>' + '<div class="tabPagination"></div>';


    var openedTabs = {};


    $(".dropdown-menu li a").click(function(event) {

        var reportId = $(this).attr("href").substring(1);
        var reportName = $(this).text();

        if(reportId in openedTabs) {
            openedTabs[reportId].tab('show');
        } else {
            var newTab = createTab(reportName, reportId);
            setUpCloseEvent(newTab);
            createTabContent(reportId);
            openedTabs[reportId] = newTab;
            newTab.tab('show');
        }
        event.preventDefault();
    });


    function createTab(tabName, contentId) {
        var tab = $(tabTemplate.format(contentId, tabName));
        tab.appendTo("#tabs");
        return tab.children("a");
    }

    function createTabContent(contentId) {
        var newTabContent = $(tabContentTemplate.format(contentId, topDatePickerMenuTemplate));
        newTabContent.appendTo("#tab-content");
        setUpDatePickers(newTabContent, contentId);
        setUpApplyButtonClickEvent(newTabContent, contentId);
    }

    function setUpDatePickers(tabContent, contentId) {

        var options = {
            startView: "months",
            minViewMode: "months",
            autoclose: true,
            language: 'ru'
        };

        $("#" + contentId + " .startPeriod").datepicker($.extend(options, {
            format: {
                toDisplay: function (date) {
                    return "01." + date.getNormalizedMonth() + "." + date.getFullYear();
                },
                toValue: function () {
                    return "";
                }
            }
        }));

        $("#" + contentId + " .endPeriod").datepicker($.extend(options, {
            format: {
                toDisplay: function (date) {
                    return date.monthDays() + "." + date.getNormalizedMonth() + "." + date.getFullYear();
                },
                toValue: function () {
                    return "";
                }
            }
        }));
    }

    function setUpApplyButtonClickEvent(tabContent, contentId) {
        tabContent.find(".apply").click(function(){

            //TODO по contentId сгенерировать контент (AJAX)
            var content = $("#template").html(); //считаем, что приходит таблица table

            $("#" + contentId + " .tabTable").html(function() {
                return $(content).fadeIn();
            });

            $("#" + contentId + " .tabPagination").html(function() {
                return $(paginationTemplate).fadeIn();
            });

            setUpPagination(tabContent, 11);  //TODO totalPages(второй параметр) динамически из AJAX
        });
    }

    function setUpPagination(tabContent, totalPages) {
        tabContent.find(".pagination").bootpag({
            total: totalPages,
            page: 1,
            maxVisible: 10,
            leaps: true,
            firstLastUse: true,
            first: '←',
            last: '→'
        }).on("page", function(event, /* page number here */ num) {
            var contentId = $(this).parent().parent().attr("id");

            //TODO тут обробатываем педжинацию, а если обновится контент?
            var content = $("#template2").html(); //считаем, что приходит таблица table

            $("#" + contentId + " .tabTable").html(function() {
                return $(content).fadeIn();
            });

        });
    }


    function setUpCloseEvent(tab) {
        tab.find(".closeTab").click(function() {
            var reportId = $(this).parent().attr("href").substring(1);
            $(this).parent().parent().remove();
            $('#' + reportId).remove();
            $('#tabs a:first').tab('show'); //TODO сюда прикрутить логику последней активной вкладки
            delete openedTabs[reportId];
        });
    }

});