<!-- 		<div id="dev-grid"></div> -->
	</div>

<?php if ($page !== 'study'): // Don't show the footer on the study page ?>
	<footer id="footer" class="center-text eight-col center-align">
		<p>
			&copy; <a href="http://iamnatehart.com">Nate Hart</a> &mdash;
			Change Language:
			<form action="/i18n/setlang/" method="post" id="language-form">
				<button title="Use Sleepless in English" value="en">English</button>,
				<button title="Anv&auml;nd Sleepless p&aring; svenska" value="se">Svenska</button>,
				<button title="השתמש Sleepless עברית" value="he">עברית</button>
			</form>
		</p>
	</footer>
<?php endif; ?>

<?php if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest'): ?>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script>!window.jQuery && document.write(unescape('%3Cscript src="static/js/min/jquery-1.7.2.min.js"%3E%3C/script%3E'))</script>
<?php if ($page === 'study' || $page === 'listing'): ?>
	<script src="static/js/jquery.fittext.js"></script>
	<script src="static/js/cards.js"></script>
<?php endif;?>
<?php if ($page === 'study'): ?>
	<script src="static/js/remove-mobile-chrome.js"></script>
	<script src="static/js/study.js"></script>
<?php endif;?>
	<script src="static/js/anime.js"></script>
	<script src="static/js/jquery.inview.js"></script>
	<script src="static/js/main.js"></script>
<?php endif; ?>
</body>
</html>