<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('projects:auto-decide')->everyMinute();
Schedule::command('users:increment-days')->daily();
Schedule::command('quests:auto-expire')->everyMinute();
