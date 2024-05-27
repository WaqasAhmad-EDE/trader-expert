import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnChanges {

  @Input() CurPair = 'EURUSD';
  showChart = false
  loadingChart = true
  loadingChartTimeOut = 4000
  constructor(
    private readonly loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.RenderChart()
  }
  ngOnChanges() {
    this.RenderChart()
  }

  getURL() {
    if (this.CurPair === 'USDCNY') {
      return "https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22symbol%22%3A%22FX_IDC%3AUSDCNY%22%2C%22interval%22%3A%22D%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22theme%22%3A%22dark%22%2C%22style%22%3A%221%22%2C%22enable_publishing%22%3Afalse%2C%22hide_top_toolbar%22%3Afalse%2C%22hide_legend%22%3Afalse%2C%22hide_side_toolbar%22%3Afalse%2C%22allow_symbol_change%22%3Afalse%2C%22save_image%22%3Afalse%2C%22watchlist%22%3A%5B%5D%2C%22details%22%3Afalse%2C%22hotlist%22%3Afalse%2C%22calendar%22%3Afalse%2C%22studies%22%3A%5B%5D%2C%22hide_volume%22%3Afalse%2C%22support_host%22%3A%22https%3A%2F%2Fwww.tradingview.com%22%2C%22height%22%3A%22100%25%22%2C%22width%22%3A%22100%25%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22advanced-chart%22%2C%22page-uri%22%3A%22www.tradingview.com%2Fwidget-wizard%2Fen%2Fdark%2Fadvanced-chart%2F%22%7D"
      // return "https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22symbol%22%3A%22FX_IDC%3AUSDCNY%22%2C%22interval%22%3A%22D%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22theme%22%3A%22dark%22%2C%22style%22%3A%221%22%2C%22enable_publishing%22%3Afalse%2C%22hide_top_toolbar%22%3Afalse%2C%22hide_legend%22%3Afalse%2C%22hide_side_toolbar%22%3Atrue%2C%22allow_symbol_change%22%3Afalse%2C%22save_image%22%3Afalse%2C%22watchlist%22%3A%5B%5D%2C%22details%22%3Afalse%2C%22hotlist%22%3Afalse%2C%22calendar%22%3Afalse%2C%22studies%22%3A%5B%5D%2C%22hide_volume%22%3Atrue%2C%22support_host%22%3A%22https%3A%2F%2Fwww.tradingview.com%22%2C%22height%22%3A%22100%25%22%2C%22width%22%3A%22100%25%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22advanced-chart%22%2C%22page-uri%22%3A%22www.tradingview.com%2Fwidget-wizard%2Fen%2Fdark%2Fadvanced-chart%2F%22%7D"
      // return "https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22symbol%22%3A%22FX_IDC%3AUSDCNY%22%2C%22interval%22%3A%22D%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22theme%22%3A%22dark%22%2C%22style%22%3A%221%22%2C%22enable_publishing%22%3Afalse%2C%22hide_top_toolbar%22%3Afalse%2C%22hide_legend%22%3Atrue%2C%22hide_side_toolbar%22%3Afalse%2C%22allow_symbol_change%22%3Afalse%2C%22save_image%22%3Afalse%2C%22watchlist%22%3A%5B%5D%2C%22details%22%3Afalse%2C%22hotlist%22%3Afalse%2C%22calendar%22%3Afalse%2C%22studies%22%3A%5B%5D%2C%22hide_volume%22%3Atrue%2C%22support_host%22%3A%22https%3A%2F%2Fwww.tradingview.com%22%2C%22height%22%3A%22100%25%22%2C%22width%22%3A%22100%25%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22advanced-chart%22%2C%22page-uri%22%3A%22www.tradingview.com%2Fwidget-wizard%2Fen%2Fdark%2Fadvanced-chart%2F%22%7D"
      // return "https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22symbol%22%3A%22OANDA%3AEURUSD%22%2C%22interval%22%3A%221%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22theme%22%3A%22dark%22%2C%22style%22%3A%221%22%2C%22enable_publishing%22%3Afalse%2C%22hide_top_toolbar%22%3Afalse%2C%22hide_legend%22%3Atrue%2C%22hide_side_toolbar%22%3Afalse%2C%22allow_symbol_change%22%3Afalse%2C%22save_image%22%3Afalse%2C%22watchlist%22%3A%5B%5D%2C%22details%22%3Afalse%2C%22hotlist%22%3Afalse%2C%22calendar%22%3Afalse%2C%22studies%22%3A%5B%5D%2C%22hide_volume%22%3Atrue%2C%22support_host%22%3A%22https%3A%2F%2Fwww.tradingview.com%22%2C%22height%22%3A%22100%25%22%2C%22width%22%3A%22100%25%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22advanced-chart%22%2C%22page-uri%22%3A%22www.tradingview.com%2Fwidget-wizard%2Fen%2Fdark%2Fadvanced-chart%2F%22%7D"
      // return "https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22symbol%22%3A%22FX_IDC%3AUSDCNY%22%2C%22interval%22%3A%22D%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22theme%22%3A%22dark%22%2C%22style%22%3A%221%22%2C%22enable_publishing%22%3Afalse%2C%22hide_top_toolbar%22%3Afalse%2C%22hide_legend%22%3Atrue%2C%22hide_side_toolbar%22%3Atrue%2C%22allow_symbol_change%22%3Afalse%2C%22save_image%22%3Afalse%2C%22watchlist%22%3A%5B%5D%2C%22details%22%3Afalse%2C%22hotlist%22%3Afalse%2C%22calendar%22%3Afalse%2C%22studies%22%3A%5B%5D%2C%22hide_volume%22%3Atrue%2C%22support_host%22%3A%22https%3A%2F%2Fwww.tradingview.com%22%2C%22height%22%3A%22100%25%22%2C%22width%22%3A%22100%25%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22advanced-chart%22%2C%22page-uri%22%3A%22www.tradingview.com%2Fwidget-wizard%2Fen%2Fdark%2Fadvanced-chart%2F%22%7D";
    }
    return "https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22symbol%22%3A%22FX%3A" + this.CurPair + "%22%2C%22interval%22%3A%22D%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22theme%22%3A%22dark%22%2C%22style%22%3A%221%22%2C%22enable_publishing%22%3Afalse%2C%22hide_top_toolbar%22%3Afalse%2C%22hide_legend%22%3Afalse%2C%22hide_side_toolbar%22%3Afalse%2C%22allow_symbol_change%22%3Afalse%2C%22save_image%22%3Afalse%2C%22watchlist%22%3A%5B%5D%2C%22details%22%3Afalse%2C%22hotlist%22%3Afalse%2C%22calendar%22%3Afalse%2C%22studies%22%3A%5B%5D%2C%22hide_volume%22%3Afalse%2C%22support_host%22%3A%22https%3A%2F%2Fwww.tradingview.com%22%2C%22height%22%3A%22100%25%22%2C%22width%22%3A%22100%25%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22advanced-chart%22%2C%22page-uri%22%3A%22www.tradingview.com%2Fwidget-wizard%2Fen%2Fdark%2Fadvanced-chart%2F%22%7D"
    // return "https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22symbol%22%3A%22FX%3A" + this.CurPair + "%22%2C%22interval%22%3A%22D%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22theme%22%3A%22dark%22%2C%22style%22%3A%221%22%2C%22enable_publishing%22%3Afalse%2C%22hide_top_toolbar%22%3Afalse%2C%22hide_legend%22%3Afalse%2C%22hide_side_toolbar%22%3Atrue%2C%22allow_symbol_change%22%3Afalse%2C%22save_image%22%3Afalse%2C%22watchlist%22%3A%5B%5D%2C%22details%22%3Afalse%2C%22hotlist%22%3Afalse%2C%22calendar%22%3Afalse%2C%22studies%22%3A%5B%5D%2C%22hide_volume%22%3Atrue%2C%22support_host%22%3A%22https%3A%2F%2Fwww.tradingview.com%22%2C%22height%22%3A%22100%25%22%2C%22width%22%3A%22100%25%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22advanced-chart%22%2C%22page-uri%22%3A%22www.tradingview.com%2Fwidget-wizard%2Fen%2Fdark%2Fadvanced-chart%2F%22%7D"
    // return "https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22symbol%22%3A%22OANDA%3A" + this.CurPair + "%22%2C%22interval%22%3A%221%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22theme%22%3A%22dark%22%2C%22style%22%3A%221%22%2C%22enable_publishing%22%3Afalse%2C%22hide_top_toolbar%22%3Afalse%2C%22hide_legend%22%3Atrue%2C%22hide_side_toolbar%22%3Afalse%2C%22allow_symbol_change%22%3Afalse%2C%22save_image%22%3Afalse%2C%22watchlist%22%3A%5B%5D%2C%22details%22%3Afalse%2C%22hotlist%22%3Afalse%2C%22calendar%22%3Afalse%2C%22studies%22%3A%5B%5D%2C%22hide_volume%22%3Atrue%2C%22support_host%22%3A%22https%3A%2F%2Fwww.tradingview.com%22%2C%22height%22%3A%22100%25%22%2C%22width%22%3A%22100%25%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22advanced-chart%22%2C%22page-uri%22%3A%22www.tradingview.com%2Fwidget-wizard%2Fen%2Fdark%2Fadvanced-chart%2F%22%7D"
    // return "https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22symbol%22%3A%22OANDA%3A" + this.CurPair + "%22%2C%22interval%22%3A%22D%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22theme%22%3A%22dark%22%2C%22style%22%3A%221%22%2C%22enable_publishing%22%3Afalse%2C%22hide_top_toolbar%22%3Afalse%2C%22hide_legend%22%3Atrue%2C%22hide_side_toolbar%22%3Atrue%2C%22allow_symbol_change%22%3Afalse%2C%22save_image%22%3Afalse%2C%22watchlist%22%3A%5B%5D%2C%22details%22%3Afalse%2C%22hotlist%22%3Afalse%2C%22calendar%22%3Afalse%2C%22studies%22%3A%5B%5D%2C%22hide_volume%22%3Atrue%2C%22support_host%22%3A%22https%3A%2F%2Fwww.tradingview.com%22%2C%22height%22%3A%22100%25%22%2C%22width%22%3A%22100%25%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22advanced-chart%22%2C%22page-uri%22%3A%22www.tradingview.com%2Fwidget-wizard%2Fen%2Fdark%2Fadvanced-chart%2F%22%7D"
    // return "https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22symbol%22%3A%22OANDA%3A" + this.CurPair + "%22%2C%22interval%22%3A%22D%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22theme%22%3A%22dark%22%2C%22style%22%3A%221%22%2C%22enable_publishing%22%3Afalse%2C%22hide_top_toolbar%22%3Atrue%2C%22hide_legend%22%3Atrue%2C%22hide_side_toolbar%22%3Atrue%2C%22allow_symbol_change%22%3Afalse%2C%22save_image%22%3Afalse%2C%22watchlist%22%3A%5B%5D%2C%22details%22%3Afalse%2C%22hotlist%22%3Afalse%2C%22calendar%22%3Afalse%2C%22studies%22%3A%5B%5D%2C%22hide_volume%22%3Atrue%2C%22support_host%22%3A%22https%3A%2F%2Fwww.tradingview.com%22%2C%22height%22%3A%22100%25%22%2C%22width%22%3A%22100%25%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22advanced-chart%22%2C%22page-uri%22%3A%22www.tradingview.com%2Fwidget-wizard%2Fen%2Fdark%2Fadvanced-chart%2F%22%7D"
  }

  async RenderChart() {
    // const loading = await this.showLoading()
    this.loadingChart = true
    const container = document.getElementById('iframeContainer') as HTMLElement;
    if (document.getElementById('iframechart') as HTMLElement) {
      container.removeChild(document.getElementById('iframechart') as HTMLElement);
    }
    const iframe = document.createElement('iframe');
    iframe.id = 'iframechart';
    iframe.className = 'iframeClass';
    iframe.style.width = '100%';
    iframe.style.height = '70vh';
    iframe.style.overflow = 'hidden';
    iframe.src = this.getURL();
    iframe.setAttribute('frameborder', '0')
    iframe.setAttribute('scrolling', 'no')
    container.appendChild(iframe);
    setTimeout(() => {
      this.loadingChart = false
      this.loadingChartTimeOut = 2000

    }, this.loadingChartTimeOut);
  }


  ionViewDidEnter() {
    this.passThroughVerticalSwipeEvents()
  }

  passThroughVerticalSwipeEvents(){

  }

  
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Updating Chart.',
    });

    loading.present();
    return loading
  }



}
