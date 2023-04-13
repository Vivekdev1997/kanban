(function($) {
    'use strict';

    window.app = {
        name: 'aside',
        setting: {
            folded: false,
            container: false,
            color: 'primary',
            status_sel: '',
            custom_column: 'DT',
            sb_custom_column: 'DT',
            custom_column_days: '',
            sb_custom_column_days: '',
            bg: ''
        }
    };

    var setting = 'jqStorage-' + app.name + '-Setting',
        storage = $.localStorage,
        color;

    if (storage.isEmpty(setting)) {
        storage.set(setting, app.setting);
    } else {
        app.setting = storage.get(setting);
    }
    var v = window.location.search.substring(1).split('&');
    for (var i = 0; i < v.length; i++) {
        var n = v[i].split('=');
        app.setting[n[0]] = (n[1] == "true" || n[1] == "false") ? (n[1] == "true") : n[1];
        storage.set(setting, app.setting);
    }

    setTheme();

    // init
    function setTheme() {
        $('.sel_task_column').val(app.setting.custom_column);
        $('.sel_sb_task_column').val(app.setting.sb_custom_column);
        $('.sel_task_column_days').val(app.setting.custom_column_days);
        $('.sel_sb_task_column_days').val(app.setting.sb_custom_column_days);
        $('body').removeClass($('body').attr('ui-class')).addClass(app.setting.bg).attr('ui-class', app.setting.bg);
        app.setting.folded ? $('#aside').removeClass('folded') : $('#aside').addClass('folded');
        $('#aside').length == 0 && (app.setting.container ? $('.app-header .navbar, .app-content').addClass('container') : $('.app-header .navbar, .app-content').removeClass('container'));

        $('.switcher input[value="' + app.setting.color + '"]').prop('checked', true);
        $('.switcher input[value="' + app.setting.bg + '"]').prop('checked', true);
        if (app.setting.folded == true) {
            $('#aside').find('i').removeClass('text-lg');
            $('#aside').find('i').addClass('text-md');
            $('.expand-menu').data('act', 'Y');
        } else {
            $('#aside').find('i').removeClass('text-md');
            $('#aside').find('i').addClass('text-lg');
            $('.expand-menu').data('act', 'N');
        }
        $('[data-target="folded"] input').prop('checked', app.setting.folded);
        $('[data-target="container"] input').prop('checked', app.setting.container);

        if (color != app.setting.color) {
            uiLoad.remove('css/theme/' + color + '.css');
            uiLoad.load('css/theme/' + app.setting.color + '.css');
            color = app.setting.color;
        }
    }

    // click to switch
    $(document).on('click.setting', '.switcher .expand-menu', function(e) {
        var $this = $(this),
            $target, $value;
        console.log($this.data('act'));
        $target = $this.closest('[data-target]').attr('data-target');
        app.setting[$target] = ($this.data('act') == 'N') ? true : false;
        storage.set(setting, app.setting);
        setTheme(app.setting);
    });
    $('#aside').mouseover(function() {
        if (!$('#aside').hasClass('bym'))
            $('#aside').toggleClass('bym');
    });
    $('#aside').mouseout(function() {
        if ($('#aside').hasClass('bym'))
            $('#aside').toggleClass('bym');
    });
    $(document).on('change', '.select_tk_opt', function() {
        var val = $(this).val();
        app.setting['status_sel'] = val;
        storage.set(setting, app.setting);
    });
    $(document).on('change', '.sel_task_grp', function() {
        var val = $(this).val();
        app.setting['in_process_grp'] = val;
        storage.set(setting, app.setting);
    });
    $(document).on('change', '.sel_task_column', function() {
        if ($(this).val() == 'DNC') {
            $('#due_next_cstm_days').modal('show');
        } else {
            app.setting['custom_column'] = $(this).val();
            storage.set(setting, app.setting);
            fetch_dashboard_data();
        }
    });
    $(document).on('click', '#sel_task_column_days_cont', function() {
        var sel_task_column_days = $('.sel_task_column_days').val();
        if (sel_task_column_days > 0) {
            app.setting['custom_column'] = 'DNC';
            app.setting['custom_column_days'] = sel_task_column_days;
            storage.set(setting, app.setting);
            fetch_dashboard_data();
            $('#due_next_cstm_days').modal('hide');
        } else {
            Swal.fire('', 'Please Enter Custom Days.', 'warning');
            return false;
        }
    });
    $(document).on('change', '.sel_sb_task_column', function() {
        if ($(this).val() == 'DNC') {
            $('#sb_due_next_cstm_days').modal('show');
        } else {
            app.setting['sb_custom_column'] = $(this).val();
            storage.set(setting, app.setting);
            load_sb_inprocess_data();
        }
    });
    $(document).on('click', '#sel_sb_task_column_days_cont', function() {
        var sel_task_column_days = $('.sel_sb_task_column_days').val();
        if (sel_task_column_days > 0) {
            app.setting['sb_custom_column'] = 'DNC';
            app.setting['sb_custom_column_days'] = sel_task_column_days;
            storage.set(setting, app.setting);
            load_sb_inprocess_data();
            $('#sb_due_next_cstm_days').modal('hide');
        } else {
            Swal.fire('', 'Please Enter Custom Days.', 'warning');
            return false;
        }
    });

})(jQuery);