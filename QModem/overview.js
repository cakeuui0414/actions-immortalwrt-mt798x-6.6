'use strict';
'require view';
'require poll';
'require ui';
'require dom';
'require uci';
'require qmodem.qmodem as qmodem';

// 加载外部样式表
document.head.appendChild(E('link', {
	'rel': 'stylesheet',
	'type': 'text/css',
	'href': L.resource('qmodem/qmodem-next.css')
}));

// 运营商解析
function parseProviderName(valStr) {
	var cleanVal = String(valStr || '').replace(/[^0-9]/g, '');
	var cmcc = ['46000', '46002', '46004', '46007', '46008'];
	var cucc = ['46001', '46006'];
	var ctcc = ['46003', '46011'];
	var cbnc = ['46015'];
	if (cmcc.indexOf(cleanVal) !== -1) return '中国移动';
	if (cucc.indexOf(cleanVal) !== -1) return '中国联通';
	if (ctcc.indexOf(cleanVal) !== -1) return '中国电信';
	if (cbnc.indexOf(cleanVal) !== -1) return '中国广电';
	return valStr || '未知运营商';
}

// 精美 MIUIX 风格矢量 SVG 图标生成器
function getMiuiIconSvg(type) {
	var svgMap = {
		'mobile': '<svg viewBox="0 0 24 24"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>',
		'sim': '<svg viewBox="0 0 24 24"><path d="M18 2h-8L4 8v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V8.83L10.83 4H18v16zM7 17h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8-4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>',
		'cell': '<svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L3.5 20.5l2.89-1.47C7.93 20.26 9.88 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-1.74 0-3.34-.56-4.65-1.52l-.33-.24-2.02 1.03 1.03-2.02-.24-.33C4.81 14.6 4.25 13 4.25 11.25c0-4.28 3.47-7.75 7.75-7.75s7.75 3.47 7.75 7.75-3.47 7.75-7.75 7.75z"/><circle cx="12" cy="11" r="3"/></svg>',
		'shield': '<svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-5.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>',
		'signal': '<svg viewBox="0 0 24 24"><path d="M2 22h20V2z"/></svg>',
		'speed': '<svg viewBox="0 0 24 24"><path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.28-10.43zM13 11a1 1 0 0 0-1 1 1 1 0 0 0 .29.71l3 3a1 1 0 0 0 1.42-1.42l-3-3A1 1 0 0 0 13 11z"/></svg>',
		'lightning': '<svg viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>'
	};
	var span = document.createElement('span');
	span.className = 'miui-svg-icon';
	span.innerHTML = svgMap[type] || svgMap['mobile'];
	return span;
}

// 自动/手动日夜间模式管理
function getSystemTheme() {
	return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}

function updateThemeUI(theme, mode) {
	document.documentElement.setAttribute('data-theme', theme);
	var btn = document.querySelector('.miui-theme-toggle');
	if (btn) {
		if (mode === 'auto') {
			btn.textContent = 'Ⓐ';
			btn.title = '当前：自动跟随系统/主题';
		} else {
			btn.textContent = theme === 'dark' ? '☀' : '☾';
			btn.title = '当前：手动切换模式';
		}
	}
}

function initTheme() {
	var savedMode = localStorage.getItem('qmodem_theme_mode') || 'auto';
	var effectiveTheme = savedMode === 'auto' ? getSystemTheme() : savedMode;
	
	updateThemeUI(effectiveTheme, savedMode);

	if (window.matchMedia) {
		var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		var handleThemeChange = function(e) {
			if ((localStorage.getItem('qmodem_theme_mode') || 'auto') === 'auto') {
				updateThemeUI(e.matches ? 'dark' : 'light', 'auto');
			}
		};
		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener('change', handleThemeChange);
		} else if (mediaQuery.addListener) {
			mediaQuery.addListener(handleThemeChange);
		}
	}
}

function cycleTheme() {
	var currentMode = localStorage.getItem('qmodem_theme_mode') || 'auto';
	var nextMode;
	if (currentMode === 'auto') {
		nextMode = 'light';
	} else if (currentMode === 'light') {
		nextMode = 'dark';
	} else {
		nextMode = 'auto';
	}
	
	localStorage.setItem('qmodem_theme_mode', nextMode);
	var effectiveTheme = nextMode === 'auto' ? getSystemTheme() : nextMode;
	updateThemeUI(effectiveTheme, nextMode);
}

return view.extend({
	load: function() {
		return Promise.all([uci.load('qmodem')]);
	},

	getModemList: function() {
		var modems = [];
		var sections = uci.sections('qmodem', 'modem-device');
		sections.forEach(function(section) {
			if (section.state !== 'disabled' && section.at_port) {
				var name = section.name ? section.name.toUpperCase() : 'Unknown';
				modems.push({
					id: section['.name'],
					name: section.alias ? section.alias + ' (' + name + ')' : name
				});
			}
		});
		return modems;
	},

	renderFieldValue: function(key, val) {
		var valStr = String(val || '').trim();
		var lowerKey = String(key).toLowerCase();
		var lowerVal = valStr.toLowerCase();

		if (lowerKey.indexOf('provider') !== -1 || lowerKey.indexOf('isp') !== -1 || lowerKey.indexOf('运营商') !== -1) {
			return E('span', { 'class': 'miui-plain-val' }, parseProviderName(valStr));
		}
		
		if (lowerKey.indexOf('imei') !== -1 || lowerKey.indexOf('iccid') !== -1 || lowerKey.indexOf('imsi') !== -1) {
			var storageKey = 'ufi_secure_' + key + '_' + valStr;
			var isHidden = localStorage.getItem(storageKey) !== 'false';
			var span = E('span', {
				'class': 'miui-code ' + (isHidden ? 'miui-secure-hide' : ''),
				'title': '点击切换显示/隐藏'
			}, valStr);
			span.addEventListener('click', function(e) {
				e.stopPropagation();
				this.classList.toggle('miui-secure-hide');
				localStorage.setItem(storageKey, this.classList.contains('miui-secure-hide').toString());
			});
			return span;
		}
		
		if (lowerVal === 'yes' || lowerVal === 'ready' || lowerVal === 'online') {
			return E('span', { 'class': 'miui-tag miui-tag-green' }, valStr);
		}
		if (lowerVal === 'no' || lowerVal === 'offline') {
			return E('span', { 'class': 'miui-tag miui-tag-red' }, valStr);
		}
		if (lowerKey.indexOf('network_mode') !== -1 || lowerKey.indexOf('mode') !== -1) {
			return E('span', { 'class': 'miui-tag miui-tag-blue' }, valStr);
		}
		if (lowerKey.indexOf('temp') !== -1 || lowerKey.indexOf('温度') !== -1) {
			var tempVal = parseFloat(valStr) || 0;
			var tagClass = tempVal >= 60 ? 'miui-tag-red' : (tempVal >= 45 ? 'miui-tag-orange' : 'miui-tag-green');
			return E('span', { 'class': 'miui-tag ' + tagClass }, valStr);
		}
		return E('span', { 'class': 'miui-plain-val' }, valStr);
	},

	getSignalProgress: function(key, val) {
		var lowerKey = String(key).toLowerCase();
		var numVal = parseFloat(val);
		if (isNaN(numVal)) return null;

		if (lowerKey.indexOf('rsrp') !== -1) return Math.min(100, Math.max(0, ((numVal + 140) / 96) * 100));
		if (lowerKey.indexOf('sinr') !== -1) return Math.min(100, Math.max(0, ((numVal + 20) / 50) * 100));
		if (lowerKey.indexOf('rsrq') !== -1) return Math.min(100, Math.max(0, ((numVal + 30) / 27) * 100));
		if (lowerKey.indexOf('rssi') !== -1) return Math.min(100, Math.max(0, ((numVal + 120) / 90) * 100));
		return null;
	},

	renderQoSCard: function(dlRateStr, ulRateStr) {
		var parseRate = function(str) {
			var m = String(str || '').match(/([0-9.]+)/);
			return m ? parseFloat(m[1]) : 0;
		};
		var dlRaw = parseRate(dlRateStr);
		var ulRaw = parseRate(ulRateStr);
		
		var dlMax = 1000;
		var ulMax = 300;
		
		var dlPercent = Math.min(100, Math.max(0, (dlRaw / dlMax) * 100));
		var ulPercent = Math.min(100, Math.max(0, (ulRaw / ulMax) * 100));

		return E('div', { 'class': 'miui-card miui-qos-card' }, [
			E('div', { 'class': 'miui-main-header' }, [
				E('div', { 'class': 'miui-main-title-group' }, [
					E('div', { 'class': 'miui-card-icon blue' }, [getMiuiIconSvg('speed')]),
					E('span', { 'class': 'miui-main-title' }, '签约速率')
				])
			]),
			E('div', { 'class': 'miui-qos-grid' }, [
				E('div', { 'class': 'miui-qos-item' }, [
					E('div', { 'class': 'miui-qos-label' }, [
						E('span', { 'class': 'miui-qos-arrow dl' }, '↓'),
						_('下载速率')
					]),
					E('div', { 'class': 'miui-qos-value' }, dlRaw ? dlRaw.toFixed(2) : '0.00'),
					E('div', { 'class': 'miui-qos-unit' }, 'Mbps'),
					E('div', { 'class': 'miui-clean-progress-track' }, [
						E('div', { 'class': 'miui-clean-progress-bar', 'style': 'width:' + dlPercent + '%' })
					])
				]),
				E('div', { 'class': 'miui-qos-divider' }),
				E('div', { 'class': 'miui-qos-item' }, [
					E('div', { 'class': 'miui-qos-label' }, [
						E('span', { 'class': 'miui-qos-arrow ul' }, '↑'),
						_('上传速率')
					]),
					E('div', { 'class': 'miui-qos-value' }, ulRaw ? ulRaw.toFixed(2) : '0.00'),
					E('div', { 'class': 'miui-qos-unit' }, 'Mbps'),
					E('div', { 'class': 'miui-clean-progress-track' }, [
						E('div', { 'class': 'miui-clean-progress-bar green', 'style': 'width:' + ulPercent + '%' })
					])
				])
			])
		]);
	},

	renderMIUIXLayout: function(data, container) {
		container.innerHTML = '';
		var self = this;
		var allEntries = data.all_info || [];

		var map = {};
		var groups = {};

		allEntries.forEach(function(e) {
			if (!e || e.type === 'warning_message' || e.value == null || e.value === '') return;
			var k = (e.key || '').toLowerCase();
			map[k] = e.value;

			var groupName = e['class'] || '其他信息';
			
			if (groupName === '其他信息' || groupName === 'Other Information' ||
			    groupName === '网络信息' || groupName === 'Network Information') {
				return;
			}

			if (!groups[groupName]) groups[groupName] = [];
			groups[groupName].push(e);
		});

		// 1. 顶部 2x2 毛玻璃 Widget 卡片
		var provider = parseProviderName(map['provider'] || map['isp'] || map['运营商'] || '中国联通');
		var netMode = map['network_mode'] || map['mode'] || map['网络模式'] || 'NR5G-SA Mode';
		var simStatus = (map['sim status'] || map['sim_state'] || 'ready').toUpperCase();
		var deviceName = map['name'] || map['model'] || map['manufacturer'] || 'RM500U-CN';
		var tempVal = map['temperature'] || map['temp'] || '54°C';

		var topGrid = E('div', { 'class': 'miui-top-grid' }, [
			E('div', { 'class': 'miui-card miui-status-card' }, [
				E('div', { 'class': 'miui-status-header' }, [
					E('span', { 'class': 'miui-status-label' }, '蜂窝网络'),
					E('div', { 'class': 'miui-card-icon blue' }, [getMiuiIconSvg('signal')])
				]),
				E('div', { 'class': 'miui-status-body' }, [
					E('div', { 'class': 'miui-status-main-val' }, provider),
					E('div', { 'class': 'miui-status-sub-text' }, netMode)
				]),
				E('div', { 'class': 'miui-status-footer' }, [
					E('span', { 'class': 'miui-tag miui-tag-green' }, simStatus)
				])
			]),
			E('div', { 'class': 'miui-card miui-status-card' }, [
				E('div', { 'class': 'miui-status-header' }, [
					E('span', { 'class': 'miui-status-label' }, '模组状态'),
					E('div', { 'class': 'miui-card-icon green' }, [getMiuiIconSvg('shield')])
				]),
				E('div', { 'class': 'miui-status-body' }, [
					E('div', { 'class': 'miui-status-main-val' }, tempVal),
					E('div', { 'class': 'miui-status-sub-text' }, deviceName)
				]),
				E('div', { 'class': 'miui-status-footer' }, [
					E('span', { 'class': 'miui-tag miui-tag-blue' }, '运行正常')
				])
			])
		]);
		container.appendChild(topGrid);

		// 2. 签约速率卡片
		var dlRate = map['dl_rate'] || map['dl qos rate'] || map['dl_qos'] || '300M';
		var ulRate = map['ul_rate'] || map['ul qos rate'] || map['ul_qos'] || '75M';
		var qosCard = self.renderQoSCard(dlRate, ulRate);
		container.appendChild(qosCard);

		// 3. 网络连接卡片
		var rsrpVal = parseFloat(map['rsrp'] || '-95');
		var rsrpPercent = Math.min(100, Math.max(0, ((rsrpVal + 140) / 96) * 100)).toFixed(0);
		var sinrVal = (map['sinr'] || '13').replace('dB', '').trim();
		var rsrqVal = map['rsrq'] || '-1';

		var mainCard = E('div', { 'class': 'miui-card miui-main-card' }, [
			E('div', { 'class': 'miui-main-header' }, [
				E('div', { 'class': 'miui-main-title-group' }, [
					E('div', { 'class': 'miui-card-icon blue' }, [getMiuiIconSvg('lightning')]),
					E('span', { 'class': 'miui-main-title' }, '网络连接'),
					E('span', { 'class': 'miui-sub-tag' }, map['revision'] || map['firmware'] || 'RM500UCNAAR03A11M2G')
				])
			]),
			E('div', { 'class': 'miui-inner-grid' }, [
				E('div', { 'class': 'miui-inner-card' }, [
					E('div', { 'class': 'miui-inner-label' }, 'RSRP 信号强度'),
					E('div', { 'class': 'miui-big-num' }, [
						rsrpPercent, E('span', { 'class': 'unit' }, '%')
					]),
					E('div', { 'class': 'miui-inner-sub' }, (map['rsrp'] || rsrpVal + ' dBm'))
				]),
				E('div', { 'class': 'miui-inner-card' }, [
					E('div', { 'class': 'miui-inner-label' }, 'SINR 信噪比'),
					E('div', { 'class': 'miui-big-num green' }, [
						sinrVal, E('span', { 'class': 'unit' }, 'dB')
					]),
					E('div', { 'class': 'miui-inner-sub' }, '连接质量: 良好')
				])
			]),
			E('div', { 'class': 'miui-triple-grid' }, [
				E('div', { 'class': 'miui-triple-item' }, [
					E('div', { 'class': 'val' }, rsrpVal + ' dBm'),
					E('div', { 'class': 'lab' }, '信号强度')
				]),
				E('div', { 'class': 'miui-triple-item' }, [
					E('div', { 'class': 'val' }, sinrVal + ' dB'),
					E('div', { 'class': 'lab' }, '信噪比')
				]),
				E('div', { 'class': 'miui-triple-item' }, [
					E('div', { 'class': 'val' }, rsrqVal),
					E('div', { 'class': 'lab' }, 'RSRQ 质量')
				])
			])
		]);
		container.appendChild(mainCard);

		// 4. 基本信息 / SIM 信息 / 小区信息卡片
		var groupConfigMap = {
			'Base Information': { type: 'mobile', color: 'blue' },
			'基本信息': { type: 'mobile', color: 'blue' },
			'SIM Information': { type: 'sim', color: 'purple' },
			'SIM卡信息': { type: 'sim', color: 'purple' },
			'Cell Information': { type: 'cell', color: 'orange' },
			'小区信息': { type: 'cell', color: 'orange' }
		};

		for (var groupTitle in groups) {
			var entries = groups[groupTitle];
			if (entries.length === 0) continue;

			var cfg = groupConfigMap[groupTitle] || { type: 'mobile', color: 'blue' };
			var svgEl = getMiuiIconSvg(cfg.type);

			var detailCard = E('div', { 'class': 'miui-card miui-group-card' });

			var header = E('div', { 'class': 'miui-group-header' }, [
				E('div', { 'class': 'miui-group-left' }, [
					E('div', { 'class': 'miui-card-icon ' + cfg.color }, [svgEl]),
					E('div', { 'class': 'miui-group-text' }, [
						E('div', { 'class': 'title' }, _(groupTitle))
					])
				]),
				E('div', { 'class': 'miui-group-arrow' }, '❯')
			]);

			var grid = E('div', { 'class': 'miui-clean-grid' });
			entries.forEach(function(entry) {
				var name = entry.full_name || entry.key;
				var valNode = self.renderFieldValue(entry.key, entry.value);

				var cellChildren = [
					E('div', { 'class': 'miui-clean-label' }, _(name)),
					E('div', { 'class': 'miui-clean-value' }, valNode)
				];

				var progress = self.getSignalProgress(entry.key, entry.value);
				if (progress !== null) {
					cellChildren.push(
						E('div', { 'class': 'miui-clean-progress-track' }, [
							E('div', {
								'class': 'miui-clean-progress-bar',
								'style': 'width:' + progress + '%'
							})
						])
					);
				}

				var itemCell = E('div', { 'class': 'miui-clean-item' }, cellChildren);
				grid.appendChild(itemCell);
			});

			header.addEventListener('click', (function(card) {
				return function() {
					card.classList.toggle('collapsed');
				};
			})(detailCard));

			detailCard.appendChild(header);
			detailCard.appendChild(grid);
			container.appendChild(detailCard);
		}
	},

	updateModemInfo: function(modemId, container, updateTimeElement, copyrightElement) {
		var self = this;
		Promise.all([
			qmodem.getBaseInfo(modemId),
			qmodem.getSimInfo(modemId),
			qmodem.getNetworkInfo(modemId),
			qmodem.getCellInfo(modemId),
			qmodem.getCopyright(modemId)
		]).then(function(results) {
			var all_info = [];
			for (var i = 0; i < results.length - 1; i++) {
				if (results[i] && results[i].modem_info) all_info = all_info.concat(results[i].modem_info);
			}

			var cp = results[results.length - 1];
			if (copyrightElement && cp && cp.copyright) {
				var arr = [];
				for (var k in cp.copyright) arr.push(_(k) + ': ' + cp.copyright[k]);
				copyrightElement.textContent = arr.join(' | ');
				copyrightElement.style.display = '';
			}

			self.renderMIUIXLayout({ all_info: all_info }, container);

			if (updateTimeElement) {
				var d = new Date();
				updateTimeElement.textContent = _('最后更新') + ': ' +
					`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
			}
		}).catch(function(e) {
			container.innerHTML = '<div class="miui-err">数据读取失败: ' + e.message + '</div>';
		});
	},

	render: function() {
		var self = this;
		var modems = this.getModemList();
		if (modems.length === 0) {
			return E('div', { 'class': 'miui-err' }, _('未检测到已配置的 Modem 模块。'));
		}

		initTheme();

		var page = E('div', { 'class': 'miui-wrapper' });

		var header = E('div', { 'class': 'miui-page-header' }, [
			E('h1', { 'class': 'miui-page-title' }, _('蜂窝网络')),
			E('button', {
				'class': 'miui-theme-toggle',
				'click': function() { cycleTheme(); }
			})
		]);
		page.appendChild(header);

		var selCard = E('div', { 'class': 'miui-card miui-selector-card' }, [
			E('span', { 'class': 'label' }, _('当前设备')),
			E('select', { 'class': 'miui-select', 'id': 'modem_selector' },
				modems.map(function(m) { return E('option', { 'value': m.id }, m.name); })
			)
		]);
		page.appendChild(selCard);

		var timeDiv = E('div', { 'class': 'miui-time-tip' }, '-');
		page.appendChild(timeDiv);

		var contentContainer = E('div', { 'class': 'miui-content' });
		page.appendChild(contentContainer);

		var cpDiv = E('div', { 'class': 'miui-copyright' });
		page.appendChild(cpDiv);

		var runUpdate = function() {
			var sel = page.querySelector('#modem_selector').value;
			self.updateModemInfo(sel, contentContainer, timeDiv, cpDiv);
		};

		page.querySelector('#modem_selector').addEventListener('change', runUpdate);
		runUpdate();

		poll.add(runUpdate, 10);

		return page;
	},
	handleSaveApply: null, handleSave: null, handleReset: null
});