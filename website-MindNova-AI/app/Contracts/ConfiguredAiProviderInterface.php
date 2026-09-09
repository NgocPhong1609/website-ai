<?php

namespace App\Contracts;

interface ConfiguredAiProviderInterface extends AiProviderInterface
{
    /**
     * Check local configuration without provider I/O or usage logging.
     */
    public function isReady(): bool;
}
