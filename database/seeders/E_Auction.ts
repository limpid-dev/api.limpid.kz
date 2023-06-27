import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Auction from '../../app/Models/Auction'
import { Duration, DateTime } from 'luxon'

export default class extends BaseSeeder {
  public static environment = ['development']
  public async run() {
    const duration = 'P20D'
    await Auction.createMany([
      {
        profileId: 1,
        wonAuctionBidId: null,
        title: 'Construction Project Tender',
        description: 'Seeking contractors for a construction project',
        industry: 'Construction',
        startingPrice: 3600,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: DateTime.now(),
      },
      {
        profileId: 1,
        wonAuctionBidId: null,
        title: 'IT Services Tender',
        description: 'Requesting proposals for IT services',
        industry: 'Technology',
        startingPrice: 10000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: null,
      },
      {
        profileId: 2,
        wonAuctionBidId: null,
        title: 'Marketing Campaign Tender',
        description: 'Looking for agencies to handle a marketing campaign',
        industry: 'Marketing',
        startingPrice: 5000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: DateTime.now(),
      },
      {
        profileId: 2,
        wonAuctionBidId: null,
        title: 'Supply Chain Tender',
        description: 'Procuring suppliers for a manufacturing company',
        industry: 'Manufacturing',
        startingPrice: 2000,
        purchasePrice: 9000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: null,
      },
      {
        profileId: 3,
        wonAuctionBidId: null,
        title: 'Consulting Services Tender',
        description: 'Inviting bids for consulting services',
        industry: 'Consulting',
        startingPrice: 2000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: DateTime.now(),
      },
      {
        profileId: 3,
        wonAuctionBidId: null,
        title: 'Event Management Tender',
        description: 'Organizing a large-scale event and seeking event management services',
        industry: 'Event Management',
        startingPrice: 15000,
        purchasePrice: 29000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: null,
      },
      {
        profileId: 4,
        wonAuctionBidId: null,
        title: 'Graphic Design Tender',
        description: 'Hiring graphic designers for a creative project',
        industry: 'Design',
        startingPrice: null,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: DateTime.now(),
      },
      {
        profileId: 4,
        wonAuctionBidId: null,
        title: 'Logistics Services Tender',
        description: 'Requesting logistics services for transportation and delivery',
        industry: 'Logistics',
        startingPrice: 5000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: null,
      },
      {
        profileId: 5,
        wonAuctionBidId: null,
        title: 'Software Development Tender',
        description: 'Seeking software development services for a custom application',
        industry: 'Technology',
        startingPrice: 20000,
        purchasePrice: 29000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: DateTime.now(),
      },
      {
        profileId: 5,
        wonAuctionBidId: null,
        title: 'Consulting Services Tender',
        description: 'Requesting consulting services for business strategy development',
        industry: 'Consulting',
        startingPrice: 8000,
        purchasePrice: 14000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: null,
      },
      {
        profileId: 6,
        wonAuctionBidId: null,
        title: 'Marketing Campaign Tender',
        description: 'Launching a marketing campaign for a new product',
        industry: 'Marketing',
        startingPrice: 10000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: DateTime.now(),
      },
      {
        profileId: 6,
        wonAuctionBidId: null,
        title: 'Architectural Design Tender',
        description: 'Seeking architectural design services for a residential project',
        industry: 'Architecture',
        startingPrice: 20000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: null,
      },
      {
        profileId: 7,
        wonAuctionBidId: null,
        title: 'Translation Services Tender',
        description: 'Requesting translation services for a set of documents',
        industry: 'Translation',
        startingPrice: 5000,
        purchasePrice: 9000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: DateTime.now(),
      },
      {
        profileId: 7,
        wonAuctionBidId: null,
        title: 'Interior Design Tender',
        description: 'Hiring interior designers for a commercial space',
        industry: 'Interior Design',
        startingPrice: 15000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: null,
      },
      {
        profileId: 8,
        wonAuctionBidId: null,
        title: 'Legal Services Tender',
        description: 'Requesting legal services for contract review and consultation',
        industry: 'Legal',
        startingPrice: 8000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: DateTime.now(),
      },
      {
        profileId: 8,
        wonAuctionBidId: null,
        title: 'Event Catering Tender',
        description: 'Seeking event catering services for a corporate event',
        industry: 'Catering',
        startingPrice: 10000,
        purchasePrice: 12000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: null,
      },
      {
        profileId: 9,
        wonAuctionBidId: null,
        title: 'IT Support Tender',
        description: 'Hiring IT support services for network infrastructure setup',
        industry: 'IT',
        startingPrice: 5000,
        purchasePrice: 9000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: DateTime.now(),
      },
      {
        profileId: 9,
        wonAuctionBidId: null,
        title: 'Photography Services Tender',
        description: 'Requesting professional photography services for an event',
        industry: 'Photography',
        startingPrice: 3000,
        type: 'Open',
        duration: Duration.fromISO(duration),
        verifiedAt: null,
      },
    ])
  }
}
