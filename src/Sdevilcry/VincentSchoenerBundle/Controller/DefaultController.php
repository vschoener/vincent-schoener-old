<?php

namespace Sdevilcry\VincentSchoenerBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swift_Mailer;

/**
 * @Route("/")
 */

class DefaultController extends Controller
{
    /**
     * @Route("/")
     * @Template()
     */
    public function indexAction()
    {
        return [];
    }

    /**
     *
     * @Route("/submitContactForm", name="submitContactForm")
     * @Template()
     *
     * @param Request $request
     * @return Response
     */
    public function submitContactFormAction(Request $request)
    {
        $state = false;
        $errorMessage = '';
        $name = $request->get('contactName');
        $email = $request->get('contactEmail');
        $subject = $request->get('contactSubject');
        $contactMessage = $request->get('contactMessage');


        /** TODO: use FormBuilder */
        if (empty($name)) {
            $errorMessage = 'Merci de renseigner votre nom';
        } elseif (empty($subject)) {
            $errorMessage = 'Merci de renseigner un sujet';
        } elseif (empty($contactMessage)) {
            $errorMessage = 'Merci de renseigner un petit message :)';
        } elseif (empty($email)) {
            $errorMessage = 'Merci de renseigner votre email';
        } else {
            $state = true;
        }

        /** @var Swift_Mailer $mailer */
        $mailer = $this->get('mailer');

        $message = \Swift_Message::newInstance();
        $message
            ->setSubject('[PORTFOLIO] : '.$subject)
            ->setFrom('vincent.schoener@gmail.com')
            ->setTo('vincent.schoener@gmail.com')
            ->setBody(
                $this->renderView(
                    'SdevilcryVincentSchoenerBundle::Emails/contact.html.twig',
                    [
                        'name' => $name,
                        'email' => $email,
                        'message' => $contactMessage,
                    ]
                )
            )
            ->setContentType('text/html')
        ;

        $mailer->send($message);

        $response = new Response();
        $response->setContent(json_encode(array(
            'state' => $state ? 'succeed' : 'failed',
            'errorMessage' => $errorMessage
        )));

        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }
}
