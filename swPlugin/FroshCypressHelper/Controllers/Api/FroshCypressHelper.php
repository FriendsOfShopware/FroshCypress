<?php

class Shopware_Controllers_Api_FroshCypressHelper extends Shopware_Controllers_Api_Rest
{
    public function indexAction(): void
    {
        $this->container->get('shopware_searchdbal.search_indexer')->build();
        $this->View()->assign('success', true);
    }
}
