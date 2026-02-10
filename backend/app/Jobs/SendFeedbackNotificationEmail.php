<?php

namespace App\Jobs;

use App\Mail\NewFeedbackNotification;
use App\Models\Feedback;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendFeedbackNotificationEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $feedback;
    protected $recipientEmail;

    /**
     * Create a new job instance.
     */
    public function __construct(Feedback $feedback, string $recipientEmail)
    {
        $this->feedback = $feedback;
        $this->recipientEmail = $recipientEmail;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Mail::to($this->recipientEmail)->send(new NewFeedbackNotification($this->feedback));
            Log::info('Feedback notification email sent', [
                'feedback_id' => $this->feedback->id,
                'recipient' => $this->recipientEmail,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send feedback notification email', [
                'feedback_id' => $this->feedback->id,
                'recipient' => $this->recipientEmail,
                'error' => $e->getMessage(),
            ]);
            // Retry job
            throw $e;
        }
    }

    /**
     * Handle job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Feedback notification email job failed', [
            'feedback_id' => $this->feedback->id,
            'recipient' => $this->recipientEmail,
            'error' => $exception->getMessage(),
        ]);
    }
}
