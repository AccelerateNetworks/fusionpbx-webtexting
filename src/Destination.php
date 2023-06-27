<?php
declare(strict_types=1);

final class Destination
{
    public string $extensionUUID;
    public string $extension;
    public string $domainUUID;
    public string $domainName;
    
    public static function Get(string $to): ?Destination
    {
        $sql = "SELECT v_extensions.extension_uuid, v_extensions.extension, v_domains.domain_uuid, v_domains.domain_name FROM webtexting_destinations,v_extensions, v_domains WHERE webtexting_destinations.phone_number = :to AND webtexting_destinations.domain_uuid = v_domains.domain_uuid AND webtexting_destinations.extension_uuid = v_extensions.extension_uuid";
        $parameters['to'] = $to;
        $db = new database;
        $row = $db->select($sql, $parameters, 'row');
        unset($parameters);
        if (!$row) {
            error_log("received message for number with no entry in webtexting_destinations: ".$to);
            return null;
        }

        $destination = new Destination();
        $destination->extensionUUID = $row['extension_uuid'];
        $destination->extension = $row['extension'];
        $destination->domainUUID = $row['domain_uuid'];
        $destination->domainName = $row['domain_name'];

        return $destination;
    }
}
