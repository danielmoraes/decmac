$(document).ready(init);

function init() {
    var new_option = $( "#new-option" ),
        chart_data = [],
        pie_chart = null,
        total_votes = 0,
        max_confidence = 0;

    function checkLength( v, n, min, max ) {
        if ( v.length > max || v.length < min ) {
            return false;
        } else {
            return true;
        }
    }

    $( "#add-option" ).button().click(function() {
        option_name = prompt('Option name');
        option_id = chart_data.length;
        b_valid = checkLength( option_name, "option name", 1, 50 );
        if ( b_valid ) {
            option_button = []
            option_button.push("<button optid=\"" + option_id + "\" id=\"opt-" + option_id + "\">");
            option_button.push(option_name);
            option_button.push("</button>");
            $("#option-list").append(option_button.join(""));
            chart_data.push([option_name, 0]);
            if (total_votes > 0) {
                pie_chart.series[0].setData(chart_data);
            }

            $( "#opt-" + option_id ).button().click(function() {
                opt_id = $(this).attr("optid");
                chart_data[opt_id][1]++;
                pie_chart.series[0].setData(chart_data);
                total_votes++;
                max_confidence = 0;
                max_confidence_id = 0;
                for (i = 0; i < chart_data.length; i++) {
                    confidence = (100*(chart_data[i][1]/total_votes)).toFixed(2);
                    if (confidence > max_confidence) {
                        max_confidence = confidence;
                        max_confidence_id = i;
                    }
                }
                if (total_votes == 1) {
                    $("#pie-chart").show();
                }
                if (max_confidence >= $("#ratio").val() &&
                    total_votes >= $("#min-sel").val()) {
                    alert("Confidence reached! The most reliable decision is: " +
                        chart_data[max_confidence_id][0] + " (Confidence: " + max_confidence + "%)");
                    destroy();
                }
            });

            $( "#opt-" + option_id ).prop("disabled", true);
        } else {
            alert("The option name must by 1-50 characters.");
        }
    });

    function destroy() {
        $("#time-limit").prop("disabled", false);
        $("#min-sel").prop("disabled", false);
        $("#ratio").prop("disabled", false);
        $("#start").prop("disabled", false);
        $("#add-option").prop("disabled", false);
        $("#cancel").prop("disabled", true);
        $('#countdown').countdown('destroy');
        $("#pie-chart").hide();
        $("#countdown").hide();
        $("#option-list").html("");
        chart_data = [];
        total_votes = 0;
        max_confidence = 0;
        pie_chart.series[0].setData(chart_data);
    }

    function lift_off() {
        best_decision = -1;
        best_decision_votes = 0;
        for (i = 1; i < chart_data.length; i++) {
            if (chart_data[i][1] > best_decision_votes) {
                best_decision = i;
                best_decision_votes = chart_data[i][1];
            }
        }
        alert("Time limit reached! The most reliable decision is: " +
              chart_data[best_decision][0] + " (Confidence: " + max_confidence + "%)");
        destroy();
    }

    $( "#start" ).button().click(function() {
        if (chart_data.length == 0) {
            alert("Please, add at least one option.");
            return;
        }

        $("#time-limit").prop("disabled", true);
        $("#min-sel").prop("disabled", true);
        $("#ratio").prop("disabled", true);
        $("#start").prop("disabled", true);
        $("#add-option").prop("disabled", true);
        $("#cancel").prop("disabled", false);

        for (i = 0; i < chart_data.length; i++) {
            $("#opt-" + i).prop("disabled", false);
        }

        var c_date = new Date();
        c_date = new Date(c_date.getTime() + $("#time-limit").val()*60000);
        $('#countdown').show();
        $('#countdown').countdown({until: c_date, onExpiry: lift_off});
    });

    $("#cancel").button().click(function() {
        destroy();
    });

    $("#cancel").prop("disabled", true);

    pie_chart = new Highcharts.Chart({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            renderTo: 'pie-chart',
        },
        title: {
            text: 'Current confidence',
            style: {
                color: '#000000'
            }
        },
        tooltip: {
            formatter: function () {
                return this.point.name + ': <b>' + Highcharts.numberFormat(this.percentage, 2) + '%</b>';
            }
        },
        plotOptions: {
            pie: {
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' %';
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Confidence',
            data: []
        }]
    });
}
